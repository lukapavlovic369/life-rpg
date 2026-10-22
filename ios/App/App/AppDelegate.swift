import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        BeyondHealthStore.shared.startObserverIfEnabled()
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

// HealthKit stays on-device. Only the existing quest completion/XP is synced by the web app.
import HealthKit

final class BeyondHealthStore {
    static let shared = BeyondHealthStore()
    static let distanceChanged = Notification.Name("BeyondHealthDistanceChanged")
    private let store = HKHealthStore()
    private var observer: HKObserverQuery?
    private let enabledKey = "beyond.health.observer.enabled"
    private let zone = TimeZone(identifier: "Europe/Zagreb")!

    func requestAccess(completion: @escaping (Result<Bool, Error>) -> Void) {
        guard HKHealthStore.isHealthDataAvailable(),
              let distance = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) else {
            completion(.success(false)); return
        }
        store.requestAuthorization(toShare: [], read: Set<HKObjectType>([distance])) { [weak self] success, error in
            if let error = error { completion(.failure(error)); return }
            guard success, let self = self else { completion(.success(false)); return }
            // HealthKit deliberately does not reveal whether READ permission was granted.
            UserDefaults.standard.set(true, forKey: self.enabledKey)
            DispatchQueue.main.async { self.startObserverIfEnabled() }
            self.store.enableBackgroundDelivery(for: distance, frequency: .immediate) { _, _ in }
            completion(.success(true))
        }
    }

    func startObserverIfEnabled() {
        guard observer == nil, HKHealthStore.isHealthDataAvailable(),
              UserDefaults.standard.bool(forKey: enabledKey),
              let distance = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) else { return }
        let query = HKObserverQuery(sampleType: distance, predicate: nil) { [weak self] _, finish, error in
            guard let self = self, error == nil else { finish(); return }
            self.readToday { result in
                if case .success(let sample) = result {
                    NotificationCenter.default.post(name: Self.distanceChanged, object: sample)
                }
                finish()
            }
        }
        observer = query
        store.execute(query)
    }

    func readToday(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard HKHealthStore.isHealthDataAvailable(),
              let distance = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) else {
            completion(.success(["available": false, "day": dayString(Date()), "meters": 0])); return
        }
        let now = Date()
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = zone
        let start = calendar.startOfDay(for: now)
        let dates = HKQuery.predicateForSamples(withStart: start, end: now, options: .strictStartDate)
        let manual = HKQuery.predicateForObjects(withMetadataKey: HKMetadataKeyWasUserEntered, allowedValues: [true])
        let predicate = NSCompoundPredicate(andPredicateWithSubpredicates: [dates, NSCompoundPredicate(notPredicateWithSubpredicate: manual)])
        let query = HKStatisticsQuery(quantityType: distance, quantitySamplePredicate: predicate, options: .cumulativeSum) { [weak self] _, statistics, error in
            if let error = error { completion(.failure(error)); return }
            guard let self = self else { return }
            let meters = max(0, statistics?.sumQuantity()?.doubleValue(for: .meter()) ?? 0)
            completion(.success(["available": true, "day": self.dayString(now), "meters": meters]))
        }
        store.execute(query)
    }

    private func dayString(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = zone
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}

@objc(BeyondHealthPlugin)
public class BeyondHealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BeyondHealthPlugin"
    public let jsName = "BeyondHealth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestAccess", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "todayDistance", returnType: CAPPluginReturnPromise)
    ]
    private var healthObserver: NSObjectProtocol?

    public override func load() {
        healthObserver = NotificationCenter.default.addObserver(forName: BeyondHealthStore.distanceChanged, object: nil, queue: .main) { [weak self] notification in
            guard let data = notification.object as? [String: Any] else { return }
            self?.notifyListeners("distanceUpdated", data: data)
        }
        BeyondHealthStore.shared.startObserverIfEnabled()
    }
    deinit { if let token = healthObserver { NotificationCenter.default.removeObserver(token) } }

    @objc func requestAccess(_ call: CAPPluginCall) {
        BeyondHealthStore.shared.requestAccess { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let available): call.resolve(["available": available, "requestCompleted": available])
                case .failure(let error): call.reject("Health access request failed.", nil, error)
                }
            }
        }
    }
    @objc func todayDistance(_ call: CAPPluginCall) {
        BeyondHealthStore.shared.readToday { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let sample): call.resolve(sample)
                case .failure(let error): call.reject("Walking and running distance could not be read.", nil, error)
                }
            }
        }
    }
}

class BeyondViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(BeyondHealthPlugin())
    }
}
