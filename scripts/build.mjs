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

await mkdir('dist/demos/product-29', {recursive:true});
for (const name of ['index.html','styles.css']) await copyFile(`demos/product-29/${name}`, `dist/demos/product-29/${name}`);
await build({entryPoints:['demos/product-29/src/main.js'],outfile:'dist/demos/product-29/viewer.js',bundle:true,format:'esm',minify:true,sourcemap:true,target:['es2022']});

await cp('assets', 'dist/assets', {recursive:true});

await mkdir('dist/product', { recursive: true });
await copyFile('product/index.html', 'dist/product/index.html');
console.log('Product detail template copied to dist/product/.');

await mkdir('dist/demos/trolley-guide', {recursive:true});
for (const name of ['index.html','styles.css']) await copyFile(`demos/trolley-guide/${name}`, `dist/demos/trolley-guide/${name}`);
await build({entryPoints:['demos/trolley-guide/src/main.js'],outfile:'dist/demos/trolley-guide/viewer.js',bundle:true,format:'esm',minify:true,sourcemap:true,target:['es2022']});
