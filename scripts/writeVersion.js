let fse = require('fs-extra')
let fs = require('fs')

let path = require('path')
const {execSync} = require('child_process')

var GIT_HASH = execSync('echo $(git rev-parse --short HEAD)').toString().trim()
let VERSION = require("../package.json").version

fse.ensureFileSync(
    path.join(__dirname, '../app/server', 'version.js')
)

fs.writeFileSync(
    path.join(__dirname, '../app/server', 'version.js'),
    `export const GIT_HASH = "${GIT_HASH}"; export const VERSION = "${VERSION}"; `,
)