# replace-css-url-loader
[![NPM version][npm-image]][npm-url]
[![License: MIT][license-image]][license-url]

[npm-url]: https://npmjs.org/package/replace-css-url-loader
[npm-image]: https://badge.fury.io/js/replace-css-url-loader.svg
[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg

Webpack loader to transform css urls using custom function.

## Install

```bash
npm i -D replace-css-url-loader
```

## Usage

### When you want to trasform `url(/assets/...)` to `url(https://domain/assets/...)`, the `webpack.config.js` is below

```javascript
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.css$/,
        use: [
            {
                loader: 'replace-css-url-loader',
                query: {
                    replace: url => url.replace(/^\/assets\//, 'https://domain/assets/')
                }
            }
        ],
      },
      ...
    ],
  }
```

