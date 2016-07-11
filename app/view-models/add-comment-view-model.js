var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var AppSettings = require("application-settings");
var validationModule = require("../utils/validate");
var Everlive = require("../lib/everlive.all.min");
var addCommentViewModel = (function (_super) {
    __extends(addCommentViewModel, _super);

    function addCommentViewModel (source) {
        _super.call(this);
        this._commentText = "";
    }

    Object.defineProperty(addCommentViewModel.prototype, "activity", {
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
    
    Object.defineProperty(addCommentViewModel.prototype, "commentText", {
        get: function () 
        {
            return this._commentText;
        },
        set: function(value)
        {
            if (this._commentText !== value) {
                this._commentText = value;
                this.notify({ object: this, eventName: observable.Observable.propertyChangeEvent, propertyName: "commentText", value: value });
            }
        }
    });
         
    addCommentViewModel.prototype.addComment = function () {
        var userId = AppSettings.getString(USER_ID);
        var el = new Everlive('cxjk07vtdea065wt');
        var data = el.data('Comments');
        var that = this;
        var data2 = el.data('Activities');
        return new Promise(function (resolve, reject) {
            if (validationModule.validate(that._commentText, [validationModule.minLengthConstraint], "Invalid comment")) {
                //Load busy indicator
                that.set("isLoading", true);
                
                data.create({ 
                        'Comment' : that._commentText,
                        'UserId': userId,
                        'ActivityId': that._activity.Id
                    },
                    function (data) {
                        var namecom = "";
                        var ID = that._activity.Id;
                        var name = AppSettings.getString(USER_ID_NAME);
                        data2.getById(ID)
                            .then(function(data){
                                namecom = data.result.Text;
                                console.log(namecom);
                                var notification = {"Android":{"data":{"title":"Friends","message": name+" has added a Comment in "+namecom,"customData": "ZZ789Y"}}};
                                el.push.notifications.create(notification,
                                    function(data){
                                    },
                                    function(error){
                                        alert("Error");
                                    });
                            },
                            function(error){
                                alert("error");
                            });
                        that.set("isLoading",false);
                        resolve();
                    },
                    function (error) {
                        that.set("isLoading",false);
                        alert(JSON.stringify(error));
                        reject();
                    });

                //Clear text field
                that.set("comment", "");
            }
        });
    };
    
    return addCommentViewModel;
})(observable.Observable);

exports.addCommentViewModel = addCommentViewModel;