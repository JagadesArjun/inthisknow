var vmModule = require("../view-models/main-view-model");
var frameModule = require("ui/frame");
var platformModule = require("platform");
var viewModule = require("ui/core/view");
var NativeScriptMonitor = require('../NativeScriptMonitor').Monitor;
var viewModel;

// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {
    var page = args.object;
    viewModel = new vmModule.MainViewModel();
    page.bindingContext = viewModel;
    clearEmailAndPassword();
}

function navigateRegister(args){
    frameModule.topmost().navigate("views/sign-up-page");
}

function clearEmailAndPassword(){
    viewModel.set("email", "");
    viewModel.set("password", "");
}

function logIn(args){
    viewModel.logIn()
        .then(function() {
            frameModule.topmost().navigate("views/activities-page");
        },
        function(error) {
            alert(error || "Can't log in! Please try again!");
        });
}

exports.navigateRegister = navigateRegister;
exports.pageLoaded = pageLoaded;
exports.logIn = logIn;