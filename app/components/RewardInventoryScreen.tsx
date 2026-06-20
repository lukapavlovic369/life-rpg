"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">●</div><div class=\"title\">REWARD INVENTORY</div></div><div class=\"subtitle\">[LEVEL REWARD STORAGE]</div><div class=\"goal\">COUPONS</div></header><section class=\"section\"><div class=\"tag\">COUPON BALANCE</div><div class=\"wallet-grid\" style=\"grid-template-columns:1fr\"><div class=\"wallet-card\"><div class=\"wallet-big\"><span class=\"neon-coin-dot\"></span><span id=\"walletCouponsText\">0</span></div><div class=\"wallet-meta\">COUPONS EARNED FROM LEVEL UPS</div></div></div></section><section class=\"section\"><div class=\"tag\">MONTHLY REWARDS</div><div class=\"notice\">No rewards this month.</div></section></div></div></main>";

export default function RewardInventoryScreen() {
  return <StaticHtmlScreen html={html} />;
}
