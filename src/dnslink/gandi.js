const _ = require('lodash')
const fp = require('lodash/fp')
const fetch = require("node-fetch");

module.exports = {
  name: 'Gandi',
  validate: ({ token, zone, record } = {}) => {
    if (_.isEmpty(token)) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_GANDI__TOKEN`)
    }

    if (fp.some(_.isEmpty)([zone, record])) {
      throw new Error(`Missing the following environment variables:
  
IPFS_DEPLOY_GANDI__ZONE
IPFS_DEPLOY_GANDI__RECORD`)
    }
  },
  link: async (_domain, hash, { token, zone, record }) => {
    const recordWithoutZone = record.replace(`.${zone}`, '')
    const link = `dnslink=/ipfs/${hash}`;
    const headers = {
      "Authorization": "Apikey " + token, 
      "Content-Type": "application/json"
    };

    const res = await (await fetch(
	  `https://api.gandi.net/v5/livedns/domains/${zone}/records/${recordWithoutZone}/TXT`,
  	  {
  		  headers,
  		  method: "PUT",
  		  body: JSON.stringify({
			  fqdn: zone,
  			  rrset_name: recordWithoutZone,
  			  rrset_type: "TXT",
  			  rrset_ttl: 300,
  			  rrset_values: [link]
  		  })
  	  }
    ))

    if (res.status !== 201) {
      throw new Error(res.statusText)
    }

    return {
      record: `${recordWithoutZone}.${zone}`,
      value: link
    }
  }
}
