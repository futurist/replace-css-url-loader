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

When you want to trasform `url(https://at.alicdn.com/t/font_148784_v4ggb6wrjmkotj4i.woff)` to `url(./static/antd/font.woff)`, in your projects' `assets` folder, the `webpack.config.js` is below

```javascript
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.css$/,
        use: [
          'css-loader',
          'replace-css-url-loader'
        ],
      },
      ...
    ],
  },
```

## Note

For `.less` file, you can place this plugin **between** `less-loader` and `css-loader`.

