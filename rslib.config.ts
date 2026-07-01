/** for build library use.  */
import { readFileSync } from 'node:fs';

import { defineConfig } from '@rslib/core';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  name: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  license: string;
  version: string;
  homepage: string;
};

const buildDate = new Date().toISOString();
const bannerText = `/**
 * ${pkg.name}
 *
 * @description ${pkg.description}
 * @author imaya, Logue
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`;

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.app.json',
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src/index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      bundle: true,
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'geojson-offset.es.js',
        },
        sourceMap: true,
      },
    },
    {
      format: 'umd',
      syntax: 'esnext',
      umdName: 'GeoJsonOffset',
      bundle: true,
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'geojson-offset.umd.js',
        },
        cleanDistPath: false,
        minify: true,
        sourceMap: true,
      },
      redirect: {
        style: {
          extension: false,
        },
      },
    },
  ],
});
