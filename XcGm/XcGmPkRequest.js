let _PK_XcGmAddOn = null;

(function loadAddOn() {
  const os = require('os');
  const platform = os.platform();
  _PK_XcGmAddOn = require(`XcGmPk_${platform}`);
})();

function _PK_XcGmCallPkApi(method, {params}) {
  const apiRequest = [method, params];
  const returnValue = _PK_XcGmAddOn.call(JSON.stringify(apiRequest));
  return JSON.parse(returnValue);
}
