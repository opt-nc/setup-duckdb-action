/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 311:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 221:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(311);
const github = __nccwpck_require__(221);
const { exec } = __nccwpck_require__(81)


try {
    const version = core.getInput('version');
    const url = `https://github.com/duckdb/duckdb/releases/download/${version}/duckdb_cli-linux-amd64.zip`
    const wget = `wget ${url}`
    const unzip = `unzip duckdb_cli-linux-amd64.zip`
    const install = 'mkdir /opt/duckdb && mv duckdb /opt/duckdb && chmod +x /opt/duckdb/duckdb && ln -s /opt/duckdb/duckdb /usr/bin/duckdb'
    const check_version = 'duckdb --version'
    const cleanup = 'rm duckdb_cli-linux-amd64.zip'

    console.log(`📦 Install DuckDB version : ${version}` );
    exec(`${wget} && ${unzip} && ${install} && ${cleanup} && ${check_version}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            core.setFailed(error.message);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log("🚀 DuckDB successfully installed.");
    });
} catch (error) {
    core.setFailed(error.message);
}
})();

module.exports = __webpack_exports__;
/******/ })()
;