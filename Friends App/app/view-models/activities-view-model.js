var __extends = this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var activityItemViewModel = require("./activity-item-view-model");
var connectItemViewModel = require("./connect-item-view-model");
var Everlive = require("../lib/everlive.all.min");
var imageSource = require("image-source");
var view = require("ui/core/view");
var platformModule = require("platform");
var dialogs = require("ui/dialogs");
var pushPlugin = require('nativescript-push-notifications');
var validationModule = require("../utils/validate");
var serviceModule = require("../view-models/service");
var cameraModule = require("camera");
var AppSettings = require("application-settings");

var dateConverter = {
    toView: function (value, format) {
        var result = format;
        var day = value.getDate();
        result = result.replace("DD", month < 10 ? "0" + day : day);
        var month = value.getMonth() + 1;
        result = result.replace("MM", month < 10 ? "0" + month : month);
        result = result.replace("YYYY", value.getFullYear());
        var hours = value.getHours();
        var min = value.getMinutes();
        var sec = value.getSeconds();
        var timeString = hours+':'+min+':'+sec;
        var H = +timeString.substr(0, 2);
        var h = (H % 12) || 12;
        var ampm = H < 12 ? "AM" : "PM";
        timeString = h + timeString.substr(2, 3) + ampm;
        result = result.replace("TIME", timeString);
        return result;
    },
    toModel: function (value, format) {
        var ddIndex = format.indexOf("DD");
        var day = parseInt(value.substr(ddIndex, 2));
        var mmIndex = format.indexOf("MM");
        var month = parseInt(value.substr(mmIndex, 2));
        var yyyyIndex = format.indexOf("YYYY");
        var year = parseInt(value.substr(yyyyIndex, 4));
        var result = new Date(year, month - 1, day);
        return result;
    }
}

var ActivitiesViewModel = (function (_super) {

    __extends(ActivitiesViewModel, _super);

    function ActivitiesViewModel(source) {
        _super.call(this);
        this._source = source;
        this._activemode = new observable.Observable();
        this._activities = new observableArray.ObservableArray();
        this._profile = new observableArray.ObservableArray();
        this._active = new observableArray.ObservableArray();
        this._isLoading = false;
        this._isisLoading = false;
        this._isisisLoading = false;
        this.set("isLoading", true);
        this.set("isisLoading", true);
        this._activitiesPromise = null;
        this._activePromise = null;
        this._profilePromise = null;
        this._selectedIndex = 0;
        this._listimage =[
            { "title": "Add PhotoAct",  "photo": "Picture_photoact.png", "category": "","bc":"#ff0066" },
            { "title": "Add Activity",  "photo": "activi.png", "category": "","bc":"#6699ff" },
            { "title": "Add TimePass",  "photo": "Ticket.png", "category": "","bc":"#ff9933" },
            { "title": "Add Event",  "photo": "Poster.png", "category": "" ,"bc":"#ff0000" },
            { "title": "Add Interest", "photo": "Percents.png", "category": "" ,"bc":"#009933" },
            { "title": "Add Fact", "photo": "Volume.png", "category": "" ,"bc":"#33cccc" }
        ];
    }

    Object.defineProperty(ActivitiesViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function(value) {
            this._isLoading = value;
            this.notify({ object: this, eventName: observable.Observable.propertyChangeEvent, propertyName: "isLoading", value: value });
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "isisisLoading", {
        get: function () {
            return this._isisisLoading;
        },
        set: function(value) {
            this._isisLoading = value;
            this.notify({ object: this, eventName: observable.Observable.propertyChangeEvent, propertyName: "isisisLoading", value: value });
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "isisLoading", {
        get: function () {
            return this._isisLoading;
        },
        set: function(value) {
            this._isisLoading = value;
            this.notify({ object: this, eventName: observable.Observable.propertyChangeEvent, propertyName: "isisLoading", value: value });
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "activities", {
        get: function () {
            this.isLoading = true;
            var that = this;

            if (!this._activitiesPromise){
                var expandExp = {
                   "UserId":{
                      "ReturnAs":"User",
                      "TargetTypeName":"Users",
                      "Expand":{
                         "Picture":{
                            "TargetTypeName":"System.Files"
                         }
                      }
                   },
                   "Picture":{
                      "ReturnAs":"Picture",
                      "SingleField":"Uri",
                      "TargetTypeName":"System.Files"
                   }
                };
                var el = new Everlive('');
                var data = el.data('Activities');
                var query = new Everlive.Query();
                query.orderDesc('CreatedAt');

                this._activitiesPromise = data.expand(expandExp).get(query);
            }

            this._activitiesPromise
                .then(function(data) {
                    for(var i = 0; i < data.result.length; i++){
                        data.result[i].dateConverter = dateConverter;
                        var activityItem = new activityItemViewModel.ActivityItemViewModel(data.result[i]);

                        data.result[i] = activityItem;
                    }

                    that._activities.push(data.result);

                    that.isLoading = false;
            }, function(error) {
                that.isLoading = false;
                alert("Activities can't be retrieved");
            });
            return this._activities;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "profileone", {
        get: function () {
            this.isisisLoading = true;
            var that = this;

            if (!this._profilePromise){
                var expandExp = {
                    "Picture":{
                        "ReturnAs":"Picture",
                        "SingleField":"Uri",
                        "TargetTypeName":"System.Files"
                    }
                };
                var el = new Everlive('');
                var data = el.data('Users');
                var query = new Everlive.Query();
                var userId = AppSettings.getString(USER_ID);

                this._profilePromise = data.expand(expandExp).getById(userId);
            }

            this._profilePromise
                .then(function(data) {
                    var activityItem = new connectItemViewModel.ActivityItemViewModel(data.result);
                    data.result = activityItem;
                    that._profile.push(data.result);

                    that.isisisLoading = false;
                }, function(error) {
                    that.isisisLoading = false;
                    alert("Activities can't be retrieved");
                });
            return this._profile;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "active", {
        get: function () {
            this.isisLoading = true;
            var that = this;

            if (!this._activePromise){
                var expandExp = {
                    "Picture":{
                        "ReturnAs":"Picture",
                        "SingleField":"Uri",
                        "TargetTypeName":"System.Files"
                    }
                };
                var el = new Everlive('');
                var data = el.data('Users');
                var query = new Everlive.Query();
                query.order('DisplayName');

                this._activePromise = data.expand(expandExp).get(query);
            }

            this._activePromise.then(function(data) {
                    for(var i = 0; i < data.result.length; i++){
                        var activityItem = new connectItemViewModel.ActivityItemViewModel(data.result[i]);
                        data.result[i] = activityItem;
                    }

                    that._active.push(data.result);

                    that.isisLoading = false;
                }, function(error) {
                    that.isisLoading = false;
                    alert("Activities can't be retrieved");
                });
            return this._active;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "listimage", {
        get: function () {

            return this._listimage;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivitiesViewModel.prototype, "selectedIndex", {
        get: function () {
            console.log(this._activemode);
            return this._selectedIndex;
        },
        enumerable: true,
        configurable: true
    });

    ActivitiesViewModel.prototype.addActivity = function () {
        var userId = AppSettings.getString(USER_ID);
        var el = new Everlive('cxjk07vtdea065wt');
        var data = el.data('Activities');
        var that = this;
        return new Promise(function (resolve, reject) {
            if(validationModule.validate(that._nuk, [validationModule.minLengthConstraint],"Invalid Activity")){
                //Load busy indicator
                that.set("_isisisLoading", true);

                data.create({
                        'Text' : that.activity,
                        'UserId': userId
                    },
                    function(data){
                        var name = AppSettings.getString(USER_ID_NAME);
                        var notification = {"Android":{"data":{"title":"Friends","message": name+" has added an activity","customData": "ZZ789Y"}}};
                        el.push.notifications.create(notification,
                            function(data){
                            },
                            function(error){
                                alert("Error");
                            });
                        that.set("_isisisLoading",false);
                        resolve();
                    },
                    function(error){
                        that.set("_isisisLoading",false);
                        alert(error);
                        reject(error);
                    });

                //Clear text field
                that.set("activity", "");
            }
        });
    };
    ActivitiesViewModel.prototype.takePicture = function () {
        var _this = this;
        var options = {
            width: 320,
            height: 480,
            keepAspectRatio: true
        };
        cameraModule.takePicture(options).then(function (picture) {
            _this.picture = picture;

        });
    };
    ActivitiesViewModel.prototype.onSaving = function (item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.picture) {
                serviceModule.service.uploadPicture(_this.picture).then(function (data) {
                    item.Photo = data.result.Id;
                    resolve(false);
                }, reject);
            }
            else {
                resolve(false);
            }
        });
    };
    Object.defineProperty(ActivitiesViewModel.prototype, "activity", {
        get: function ()
        {
            return this._nuk;
        },
        set: function(value)
        {
            if (this._nuk !== value) {
                this._nuk = value;
            }
        }
    });
    Object.defineProperty(ActivitiesViewModel.prototype, "picture", {
        get: function () {
            return this._picture;
        },
        set: function (value) {
            if (this._picture != value) {
                this._picture = value;
                this.notifyPropertyChange("picture", value);
            }
        },
        enumerable: true,
        configurable: true
    });
    return ActivitiesViewModel;
})(observable.Observable);

function isValidImageUrl(url) {
    return url && (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1);
}

exports.ActivitiesViewModel = ActivitiesViewModel;
