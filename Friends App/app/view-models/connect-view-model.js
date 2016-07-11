var observable = require("data/observable");
var observableArray = require("data/observable-array");
var activityItemViewModel = require("./connect-item-view-model");
var Everlive = require("../lib/everlive.all.min");
var imageSource = require("image-source");
var view = require("ui/core/view");
var platformModule = require("platform");
var dialogs = require("ui/dialogs");
var pushPlugin = require('nativescript-push-notifications');


var ActivitiesViewModel = (function (_super) {

    __extends(ActivitiesViewModel, _super);

    function ActivitiesViewModel(source) {
        _super.call(this);
        this._source = source;
        this._activities = new observableArray.ObservableArray();
        this._isLoading = false;
        this.set("isLoading", true);
        this._activitiesPromise = null;
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

    Object.defineProperty(ActivitiesViewModel.prototype, "activities", {
        get: function () {
            this.isLoading = true;
            var that = this;

            if (!this._activitiesPromise){
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

                this._activitiesPromise = data.expand(expandExp).get(query);
            }

            this._activitiesPromise
                .then(function(data) {
                    for(var i = 0; i < data.result.length; i++){
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

    return ActivitiesViewModel;
})(observable.Observable);

function isValidImageUrl(url) {
    return url && (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1);
}

exports.ActivitiesViewModel = ActivitiesViewModel;
