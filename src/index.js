const {
  join,
  relative,
  dirname
} = require('path');
const loaderUtils = require('loader-utils');
const replaceCSSUrl = require('replace-css-url');
const fetch = require('node-fetch');
const sha1 = require('sha1');
const mkdirp = require('mkdirp');
const fs = require('fs');
const url = require('url');

module.exports = function (source, map, meta) {
  const {
    cacheable,
    resourcePath
  } = this;
  cacheable && cacheable();

  const {
    context
  } = this.options
  const callback = this.async();

  const {
    replace,
    match,
    saveDir = ['out', 'temp']
  } = loaderUtils.getOptions(this) || {};

  const oldCSS = source;
  const rootPath = context;

  if(typeof replace === 'function') {
    const newCSS = replaceCSSUrl(oldCSS, url => replace(url, resourcePath, this))
    callback(null, newCSS, map, meta)
    return
  }

  const downloadArr = [];
  replaceCSSUrl(oldCSS, link => {
    const urlObj = url.parse(link);
    let condition = urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    const matchArr = /\.([^.]+)$/.exec(urlObj.pathname);
    if (match && condition) {
      condition = new RegExp(match).test(link)
    }
    if (condition && matchArr) {
      const ext = matchArr[1];
      downloadArr.push({
        link,
        urlObj,
        ext
      });
    }
    return link;
  });

  Promise.all(downloadArr.map((obj) => {
    const {
      link,
      ext
    } = obj;
    return fetch(link).then(res => {
      return new Promise((resolve, reject) => {
        const filepath = join(rootPath, join(...saveDir), sha1(link) + '.' + ext);
        mkdirp.sync(dirname(filepath));
        const dest = fs.createWriteStream(filepath);
        const stream = res.body.pipe(dest);
        stream.on('error', err => {
          reject(err);
        });
        stream.on('finish', () => {
          obj.filepath = filepath;
          resolve(obj);
        });
      });
    });
  })).then(v => {
    const newCSS = replaceCSSUrl(oldCSS, link => {
      const obj = downloadArr.find(v => v.link === link)
      if (obj) {
        const {
          urlObj,
          filepath
        } = obj
        const newLink = relative(dirname(resourcePath), filepath) + (urlObj.search || '') + (urlObj.hash || '');
        return newLink
      } else {
        return link
      }
    });
    callback(null, newCSS, map, meta);
  }).catch(err=>{
    callback(err)
  })
};
