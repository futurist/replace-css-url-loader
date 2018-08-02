const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entryFilePath = path.join(__dirname, 'source/entry.css');
const outputDirPath = path.join(__dirname, 'output');
const outputFileName = 'output.js';
const outputCSSFileName = 'bundle.css';
const outputCSSPath = path.join(outputDirPath, outputCSSFileName);

const getTestWebPackConfig = loader => {
  return {
    entry: entryFilePath,
    output: {
      path: outputDirPath,
      filename: outputFileName
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: ['css-loader', loader]
          })
        }
      ]
    },
    plugins: [new ExtractTextPlugin(outputCSSFileName)]
  };
};

const happyPathCheck = (done, error, stats, expectedURL) => {
  expect(error).to.equal(null);

  fs.readFile(outputCSSPath, 'utf8', (err, contents) => {
    expect(err).to.equal(null);
    expect(contents).to.be.a('string');
    expect(contents).is.include(expectedURL);
    done();
  });
};

describe('Replace css url loader test', () => {
  it('should transform relative url to absolute url', done => {
    webpack(
      getTestWebPackConfig({
        loader: '__this-loader',
        query: {replace: (url, f)=> {
          expect(f).to.equal('test/source/entry.css')
          return url.replace('/assets/', 'https://domain/assets/')
        }}
      }),
      (error, stats) =>
        happyPathCheck(done, error, stats, 'https://domain/assets/')
    );
  });

  it('should transform relative url to absolute url with single quot', done => {
    webpack(
      getTestWebPackConfig({
        loader: '__this-loader',
        query: {replace: (url)=> url.replace('/assets/', 'https://domain/assets/')}
      }),
      (error, stats) =>
        happyPathCheck(done, error, stats, "'https://domain/assets/")
    );
  });

  it('should transform old url to new url', done => {
    webpack(
      getTestWebPackConfig({
        loader: '__this-loader',
        query: {replace: (url)=> url.replace('/assets/', '/dir/assets/')}
      }),
      (error, stats) => happyPathCheck(done, error, stats, '/dir/assets/')
    );
  });

  it('should transform old url to new url with single quot', done => {
    webpack(
      getTestWebPackConfig({
        loader: '__this-loader',
        query:{replace: (url)=> url.replace('/assets/', '/dir/assets/')}
      }),
      (error, stats) => happyPathCheck(done, error, stats, "'/dir/assets/")
    );
  });

});
