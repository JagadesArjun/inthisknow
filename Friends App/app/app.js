var application = require("application");

/*
 * Define constants which we will use across the application
 */
global.BS_API_KEY = "";
global.BS_SCHEME = "http";
global.BS_URL = "";
global.TOKEN_DATA_KEY = "authenticationToken";
global.USER_ID = "userId";
global.USER_ID_NAME = "userIdName";
global.USER_ID_ID = "userIdId";
global.EVERLIVE = null;
global.MONITOR = null;
global.IS_PUSH_REGISTER = "";
global.PAGE_ID = "0";

application.onLaunch = function (context) {
    var serviceModule = require("./view-models/service");
    if (serviceModule.service.isAuthenticated) {
        application.mainModule = "views/activities-page";
    }
    else {
        application.mainEntry = {
            moduleName: "views/main-page",
            backstackVisible: false
        };
    }
};

application.onSuspend = function () {
    console.log("Application suspended.");
};

application.onResume = function (context) {
    var serviceModule = require("./view-models/service");
    if (serviceModule.service.isAuthenticated) {
        application.mainModule = "views/activities-page";
    }
    else {
        application.mainEntry = {
            moduleName: "views/main-page",
            backstackVisible: false
        };
    }
};

application.onExit = function () {
    console.log("Application will exit.");
    if(MONITOR !== null){
        MONITOR.stop();
    }
};

application.onLowMemory = function () {
    console.log("Memory is low.");
};

application.onUncaughtError = function (error) {
    console.log("Application error");
};

application.start();
