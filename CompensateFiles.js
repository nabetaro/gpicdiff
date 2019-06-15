'use strict';

const fs = require('fs')
const config = require('./package.json')

exports.default = async function(context) {

  const PLATFORM = context.packager.platform.name

  switch (PLATFORM) {
  case 'linux':
    try {
      fs.writeFileSync("build/linux-unpacked/version", config.version)
      console.log('version file created.')
      fs.copyFileSync("LICENSE", "build/linux-unpacked/LICENSE")
      console.log('LICENSE file copied.')
    }catch(e){
      console.log(e)
    }
    break
  default:
    break
  }
}
