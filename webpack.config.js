const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

module.exports = {
  quiet: true,
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    root: [
      path.resolve('src/scripts')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel",
      }
    ]
  },
  externals: [
    nodeModules,
    (() => {
      const IGNORES = ['electron'];
      return (context, request, cb) => {
        if (IGNORES.indexOf(request) >= 0) {
          return cb(null, 'require("' + request + '")');
        }
        return cb();
      };
    })(),
  ],
};
