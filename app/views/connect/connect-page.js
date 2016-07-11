var vmModule = require("../../view-models/connect-view-model");
var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var platformModule = require("platform");
var AppSettings = require("application-settings");

var viewModel;

function pageNavigatingTo(args) {
    var page = args.object;
    viewModel = new vmModule.ActivitiesViewModel();
    page.bindingContext = viewModel;

}

function onActivityTap(args) {
    frameModule.topmost().navigate({
        moduleName: "views/connect/view-page",
        context: viewModel.activities.getItem(args.index)
    });
}
function addFriend(){
    frameModule.topmost().navigate("views/addConnect/add-connect-page");
}
function logout(args){

    frameModule.topmost().navigate("views/main-page");
    AppSettings.remove(TOKEN_DATA_KEY);
    AppSettings.remove(USER_ID);
}
function enablenotify(args){
    frameModule.topmost().navigate("main-page");
}

exports.enablenotify = enablenotify;
exports.pageNavigatingTo = pageNavigatingTo;
exports.onActivityTap = onActivityTap;
exports.addFriend = addFriend;
exports.logout = logout;
