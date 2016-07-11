var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var serviceModule = require("../view-models/service");
var cameraModule = require("camera");
var observable = require("data/observable");
var validationModule = require("../utils/validate");
var AppSettings = require("application-settings");
var Everlive = require("../lib/everlive.all.min");
var AddActivityViewModel = (function (_super) {
    __extends(AddActivityViewModel, _super);

    function AddActivityViewModel(source) {
        _super.call(this);
        this._activity = "";
    }

    AddActivityViewModel.prototype.addActivity = function () {
        var userId = AppSettings.getString(USER_ID);
        var el = new Everlive('');
        var data = el.data('Activities');
        var that = this;
        return new Promise(function (resolve, reject) {
            if(validationModule.validate(that._activity, [validationModule.minLengthConstraint],"Invalid Activity")){
                //Load busy indicator
                that.set("isLoading", true);
                
                data.create({ 
                        'Text' : that.activity,
                        'UserId': userId,
                        'Type' : "Timepass"
                    },
                    function(data){
                        var name = AppSettings.getString(USER_ID_NAME);
                        var notification = {"Android":{"data":{"title":"Friends","message": name+" has added an timepass","customData": "ZZ789Y"}}};
                        el.push.notifications.create(notification,
                            function(data){
                            },
                            function(error){
                                alert("Error");
                            });
                        that.set("isLoading",false);
                        resolve();
                    },
                    function(error){
                        that.set("isLoading",false);
                        alert(error);
                        reject(error);
                    });

                //Clear text field
                that.set("activity", "");
            }
        });
    };
    AddActivityViewModel.prototype.takePicture = function () {
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
    AddActivityViewModel.prototype.onSaving = function (item) {
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
    Object.defineProperty(AddActivityViewModel.prototype, "activity", {
        get: function () 
        {
            return this._activity;
        },
        set: function(value)
        {
            if (this._activity !== value) {
                this._activity = value;
                console.log(value);
            }
        }
    });
    Object.defineProperty(AddActivityViewModel.prototype, "picture", {
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
    return AddActivityViewModel;
})(observable.Observable);

exports.AddActivityViewModel = AddActivityViewModel;