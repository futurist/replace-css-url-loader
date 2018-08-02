const {join, relative} = require('path').posix;
const loaderUtils = require('loader-utils');
const replaceCSSUrl = require('replace-css-url');

module.exports = function(source, map) {
  const {cacheable, resourcePath, rootContext} = this;
  cacheable && cacheable();

  let {replace} = loaderUtils.getOptions(this);

  if (typeof replace !== 'function') {
    throw '[replace-css-url] options.replace have to be function!';
  }

  const fileName = join(rootContext||'', relative('', resourcePath))

  const oldCSS = source;
  const newCSS = replaceCSSUrl(oldCSS, url => replace(url, fileName));

  return newCSS
};

