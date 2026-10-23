import { build } from 'esbuild';
import { mkdir, copyFile, cp } from 'node:fs/promises';

// Preserve the existing static catalogue; bundle only the isolated pilot.
await mkdir('dist/demos/product-28', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await cp('data', 'dist/data', { recursive: true });
for (const name of ['index.html', 'styles.css']) {
  await copyFile(`demos/product-28/${name}`, `dist/demos/product-28/${name}`);
}
await cp('demos/product-28/assets', 'dist/demos/product-28/assets', { recursive: true });
await build({
  entryPoints: ['demos/product-28/src/main.js'],
  outfile: 'dist/demos/product-28/viewer.js',
  bundle: true, format: 'esm', minify: true, sourcemap: true, target: ['es2022'],
});
console.log('Static catalogue and Product 28 pilot built in dist/.');
