var vmModule = require("../view-models/add-timepass-view-model");

var frameModule = require("ui/frame");
var platformModule = require("platform");
var Everlive = require("../lib/everlive.all.min");
var AppSettings = require("application-settings");
var viewModule = require("ui/core/view");
var viewModel;
function pageNavigatedTo(args) {
    var page = args.object;
    viewModel = new vmModule.AddActivityViewModel();
    page.bindingContext = viewModel;

    verifyUserPermissions();
}

function setFocusToTextField() {
    var page = frameModule.topmost().currentPage;
    var commentTextBox = viewModule.getViewById(page, "add-activity-text");

    commentTextBox.focus();
}
function takePictureButtonTap() {
    viewModel.takePicture();
}
function verifyUserPermissions(){
    var userId = AppSettings.getString(USER_ID);
    if(typeof(userId) === 'undefined' || userId === ""){
        frameModule.topmost().navigate("views/main-page");
    }
}

function backButtonClicked(args){
    if (frameModule.topmost().canGoBack) {
        frameModule.topmost().goBack();
    } else {
        frameModule.topmost().navigate("views/activities-page");
    }
}

function addActivity() {
    viewModel.addActivity()
    .then(function() {
            if (frameModule.topmost().canGoBack) {
                frameModule.topmost().goBack();
            } else {
                frameModule.topmost().navigate("views/activities-page");
            }
    },
    function(error) {
        alert("Login Required");
    });
}

exports.backButtonClicked = backButtonClicked;
exports.pageNavigatedTo = pageNavigatedTo;
exports.addActivity = addActivity;
exports.takePictureButtonTap = takePictureButtonTap;