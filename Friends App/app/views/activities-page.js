var vmModule = require("../view-models/activities-view-model");
var newvmModule = require("../view-models/add-activity-view-model")
var frameModule = require("ui/frame");
var view = require("ui/core/view");
var viewModule = require("ui/core/view");
var validationModule = require("../utils/validate");
var observable = require("data/observable");
var platformModule = require("platform");
var AppSettings = require("application-settings");
var newviewModel;
var viewModel;
function pageNavigatingTo(args) {
    var page = args.object;
    console.log(page);
    viewModel = new vmModule.ActivitiesViewModel();
    page.bindingContext = viewModel;
    verifyUserPermissions();
}
function onActivityTap(args) {
    frameModule.topmost().navigate({
        moduleName: "views/activity-page",
        context: viewModel.activities.getItem(args.index)
    });
}

function onActivityNewTap(args) {
    frameModule.topmost().navigate({
        moduleName: "views/connect/view-page",
        context: viewModel.active.getItem(args.index)
    });
}

function connectOne(args){
    if(args.index==1){
        frameModule.topmost().navigate("views/add-activity-page");
    }else if(args.index==2){
        frameModule.topmost().navigate("views/add-timepass-page");
    }else if(args.index==3){
        frameModule.topmost().navigate("views/add-event-page");
    }else if(args.index==4){
        frameModule.topmost().navigate("views/add-interest-page");
    }else if(args.index==0){
        frameModule.topmost().navigate("views/add-photo-activity-page");
    }else{
        frameModule.topmost().navigate("views/add-fact-page");
    }
}

function addActivity(){
    frameModule.topmost().navigate("views/add-activity-page");
}


function connect(){
    frameModule.topmost().navigate("views/connect/connect-page");
}

function enablenotify(args){
    frameModule.topmost().navigate("main-page");
}

function profile(args){
    frameModule.topmost().navigate("views/profile/profile-page");
}

function logout(args){

    frameModule.topmost().navigate("views/main-page");
    AppSettings.remove(TOKEN_DATA_KEY);
    AppSettings.remove(USER_ID);
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


exports.backButtonClicked = backButtonClicked;
exports.addActivity = addActivity;
exports.takePictureButtonTap = takePictureButtonTap;
exports.pageNavigatingTo = pageNavigatingTo;
exports.onActivityTap = onActivityTap;
exports.onActivityNewTap = onActivityNewTap;
exports.logout = logout;
exports.addActivity = addActivity;
exports.connect = connect;
exports.enablenotify = enablenotify;
exports.profile = profile;
exports.connectOne = connectOne;