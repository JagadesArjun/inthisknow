var vmModule = require("../../view-models/profile-view-model");
var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var platformModule = require("platform");
var AppSettings = require("application-settings");

var viewModel;

function pageNavigatingTo(args) {
    var page = args.object;
    viewModel = new vmModule.MainViewModel();
    page.bindingContext = viewModel;

}
function logout(args){

    frameModule.topmost().navigate("views/main-page");
    AppSettings.remove(TOKEN_DATA_KEY);
    AppSettings.remove(USER_ID);
}
exports.pageNavigatingTo = pageNavigatingTo;
exports.logout = logout;
