var AppSettings = require("application-settings");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Everlive = require("../lib/everlive.all.min");
var activityItemViewModel = require("./activity-item-view-model");


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

var ActivityViewModel = (function (_super) {
    __extends(ActivityViewModel , _super);

    function ActivityViewModel (source) {
        _super.call(this);
        this._activity = new observable.Observable();
        this._comments = new observableArray.ObservableArray();
        this._isLoading = false;
        this._commentsPromise = null;
    }

    Object.defineProperty(ActivityViewModel.prototype, "isLoading", {
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

    Object.defineProperty(ActivityViewModel.prototype, "activity", {
        get: function ()
        {
            return this._activity;
        },
        set: function(value)
        {
            if (this._activity !== value) {
                this._activity = value;
                this.notify({ object: this, eventName: observable.Observable.propertyChangeEvent, propertyName: "activity", value: value });
            }
        }
    });

    Object.defineProperty(ActivityViewModel.prototype, "comments", {
        get: function ()
        {
            this.isLoading = true;
            var that = this;

            if (!this._commentsPromise){
                var el = new Everlive('cxjk07vtdea065wt');
                var commentsData = el.data('Activities');

                var query = new Everlive.Query();
                query.where().eq("UserId", that._activity.Id);
                query.orderDesc("CreatedAt");

                var expandExp = {
                    "UserId":{
                        "ReturnAs":"User",
                        "TargetTypeName":"Users",
                        "Expand":{
                            "Picture":{
                                "TargetTypeName":"System.Files"
                            }
                        }
                    }
                };

                this._commentsPromise = commentsData.expand(expandExp).get(query);
            }

            this._commentsPromise
                .then(function(data) {
                    if (data && data.count !== 0)
                    {
                        for (i = 0; i < data.count; i++)
                        {
                            data.result[i].dateConverter = dateConverter;
                            var activityItem = new activityItemViewModel.ActivityItemViewModel(data.result[i]);
                            data.result[i] = activityItem;
                        }

                        that._comments.push(data.result);
                    }
                    that.isLoading = false;
                },
                function(error) {
                    alert(JSON.stringify(error));
                    that.isLoading = false;
                });
            return this._comments;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ActivityViewModel.prototype, "activityDateFormatted", {
        get: function ()
        {
            var m_names = new Array("JAN", "FEB", "MAR",
                "APR", "MAY", "JUN", "JUL", "AUG", "SEP",
                "OCT", "NOV", "DEC");

            var d = new Date(this._activity.CreatedAt);
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            var curr_year = d.getFullYear();
            var dateString = m_names[curr_month] + " " + curr_date + ", " + curr_year;

            return dateString;
        }
    });

    Object.defineProperty(ActivityViewModel.prototype, "userCanEditProfile", {
        get: function ()
        {
            var userId = AppSettings.getString(USER_ID);
            return this._activity.Id === userId;
        }
    });

    ActivityViewModel.prototype.deleteActivity = function () {
        var that = this;

        return new Promise(function (resolve, reject) {
            var el = new Everlive('cxjk07vtdea065wt');
            var activities = el.data('Activities');

            activities.destroySingle({ Id: that._activity.Id },
                function(){
                    return resolve();
                },
                function(error){
                    alert(JSON.stringify(error));
                    return reject();
                }
            );
        });
    };

    return ActivityViewModel;
})(observable.Observable);

exports.ActivityViewModel = ActivityViewModel;