var observable = require("data/observable");
var observableArray = require("data/observable-array");
var AppSettings = require("application-settings");

var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        _super.call(this);
        this._user = new observableArray.ObservableArray();
    }
    Object.defineProperty(MainViewModel.prototype, "user", {
        get: function () {
                this.isLoading = true;
                var that = this;

                if (!this._user){
                    var expandExp = {
                        "Picture":{
                            "ReturnAs":"Picture",
                            "SingleField":"Uri",
                            "TargetTypeName":"System.Files"
                        }
                    };
                    var el = new Everlive('cxjk07vtdea065wt');
                    var data = el.data('Users');
                    var UserID = AppSettings.getString(USER_ID_ID);
                    console.log(UserID);
                    this._userPromise = data.expand(expandExp).getById(UserID);
                }

                this._userPromise
                    .then(function(data) {
                        for(var i = 0; i < data.result.length; i++){
                            data.result[i] = data.result[i];
                        }

                        that._user.push(data.result);

                        that.isLoading = false;
                    }, function(error) {
                        that.isLoading = false;
                        alert("Activities can't be retrieved");
                    });
                return this._activities;
            },
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
                this.notifyPropertyChange("user", value);
            }
        },
        enumerable: true,
        configurable: true
    });
    return MainViewModel;
})(observable.Observable);
exports.MainViewModel = MainViewModel;