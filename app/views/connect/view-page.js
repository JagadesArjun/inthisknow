var vmModule = require("../../view-models/view-view-model");
var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var platformModule = require("platform");
var viewModule = require("ui/core/view");
var viewModel;

function pageNavigatedTo(args) {
    var page = args.object;

    viewModel = new vmModule.ActivityViewModel();
    viewModel.activity = page.navigationContext;

    page.bindingContext = viewModel

    if (platformModule.device.os === "iOS") {
        var scrollView = viewModule.getViewById(page, "scrollView");
        scrollView.ios.directionalLockEnabled = true;

        var listView = viewModule.getViewById(page, "commentsList");
        listView.ios.scrollEnabled = false;
    }

}

function onActivityTap(args) {
    frameModule.topmost().navigate({
        moduleName: "views/activity-page",
        context: viewModel.comments.getItem(args.index)
    });
}
function editAboutButton(args) {
    frameModule.topmost().navigate("views/connect/about-page");
}
function backButtonClicked(args){
    goBack();
}

function goBack(){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate("views/connect/connect-page");
    }
}

exports.editAboutButton = editAboutButton;
exports.backButtonClicked = backButtonClicked;
exports.pageNavigatedTo = pageNavigatedTo;
exports.onActivityTap = onActivityTap;