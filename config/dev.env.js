'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:8080"'
  // BASE_API: '"http://39.98.190.128:8080"',
  // BASE_API: '"http://192.168.2.109:8080"',
  // BASE_API: '"https://www.1688bee.com"',
  BASE_API: '"http://192.168.2.110:8080"',
});
