import { cp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;

const root = resolve(import.meta.dirname, '..');
loadEnvConfig(root);
for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']) {
  if (!process.env[key]) throw new Error(`Missing ${key}. Keep your existing .env.local in the project root before building iOS.`);
}
// The native bundle has no Node server. Preserve the Vercel app/API and export a separate copy.
const stage = join(root, '.native-build');
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
for (const name of ['app', 'public', 'package.json', 'tsconfig.json', 'postcss.config.mjs']) {
  await cp(join(root, name), join(stage, name), { recursive: true });
}
await rm(join(stage, 'app/api'), { recursive: true, force: true });
// Build against the root's installed dependencies, without copying node_modules.
const { symlink } = await import('node:fs/promises');
await symlink(join(root, 'node_modules'), join(stage, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
await writeFile(join(stage, 'next.config.mjs'), `export default { output: 'export', images: { unoptimized: true }, trailingSlash: true, turbopack: { root: ${JSON.stringify(root)} } };\n`);
// Embedded screens use their existing fonts; avoid an external Google Fonts build dependency.
await writeFile(join(stage, 'app/layout.tsx'), `import './globals.css';\nexport const metadata = { title: 'Beyond Leveling', description: 'Level Up Your Real Life' };\nexport const viewport = { themeColor: '#020711', viewportFit: 'cover' };\nexport default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body className="min-h-full flex flex-col">{children}</body></html>; }\n`);
await new Promise((accept, reject) => {
  const child = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build', stage, '--webpack'], { cwd: root, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? accept() : reject(new Error(`Native web build failed (${code}).`)));
});
await access(join(stage, 'out/index.html'));
await rm(join(root, 'native-web'), { recursive: true, force: true });
await cp(join(stage, 'out'), join(root, 'native-web'), { recursive: true });
console.log('Native web bundle ready. Run npm run ios:sync.');
