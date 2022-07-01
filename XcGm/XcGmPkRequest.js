let XcGmAddOn = null;

(function loadAddOn() {
  const os = require('os');
  const platform = os.platform();
  XcGmAddOn = require(`XcGmPk_${platform}`);
})();

function XcGmCallPkApi(method, {params}) {
  const apiRequest = [method, params];
  const returnValue = XcGmAddOn.call(JSON.stringify(apiRequest));
  return JSON.parse(returnValue);
}
