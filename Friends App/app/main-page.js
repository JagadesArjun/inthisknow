var vmModule = require("./main-view-model");
var AppSettings = require("application-settings");
var frameModule = require("ui/frame");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
function logout(args){

    frameModule.topmost().navigate("views/main-page");
    AppSettings.remove(TOKEN_DATA_KEY);
    AppSettings.remove(USER_ID);
}
exports.pageLoaded = pageLoaded;
exports.logout = logout;
