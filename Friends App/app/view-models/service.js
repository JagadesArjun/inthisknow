var observable = require("data/observable");
var Everlive = require("../lib/everlive.all.min");
var dialogs = require("ui/dialogs");
var validationModule = require("../utils/validate");
var AppSettings = require("application-settings");
var Service = (function () {
    function Service() {
    }
    Object.defineProperty(Service.prototype, "isAuthenticated", {
        get: function () {
            return AppSettings.hasKey(TOKEN_DATA_KEY);
        },
        enumerable: true,
        configurable: true
    });
    Service.prototype.logout = function () {
        AppSettings.setString(TOKEN_DATA_KEY, "");
        AppSettings.setString(USER_ID, "");
    };
    Service.prototype.clearLocalSettings = function () {
        AppSettings.remove(TOKEN_DATA_KEY);
    };
    Service.prototype.uploadPicture = function (picture) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var everlive = _this.createEverlive();
            console.log("success");
            var file = {
                "Filename": "NativeScriptIsAwesome.jpg",
                "ContentType": "image/jpeg",
                "base64": picture.toBase64String(enums.ImageFormat.jpeg, 100)
            };
            everlive.Files.create(file, function (data) {
                resolve(data);
            }, function (error) {
                alert("Error");
            });
        });
    };
    Service.prototype.createEverlive = function () {
        if (!this._everlive) {
            this._everlive = new Everlive({
                apiKey: "",
                token: AppSettings.getString(TOKEN_DATA_KEY)
            });
        }
        return this._everlive;
    };
    return Service;
})();
exports.Service = Service;
exports.service = new Service();