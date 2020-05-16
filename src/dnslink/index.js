const make = require('./maker')

module.exports = {
  cloudflare: make(require('./cloudflare')),
  dnsimple: make(require('./dnsimple')),
  gandi: make(require('./gandi'))
}
