import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/client.ts'],
  format: ['esm'],
  outDir: 'build',
  target: 'es2022',
  sourcemap: true,
  clean: true,
  splitting: false,
  dts: false,
  platform: 'node',
})
