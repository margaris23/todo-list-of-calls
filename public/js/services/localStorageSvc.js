// Initialize services: Normally this should be done will a js-loader
var services = angular.module('TodoCalls.services',[]);

services.factory('LocalStorage',['$window', function ($window) {
        console.log('LocalStorage started');

        var _localStorage = null;
        var DOMAIN_NAME = "todo-list-calls";

        // Localstorage domain object
        var domain = {
            name: DOMAIN_NAME,
            version: '1.0',
            date: Date.now(),   // current date
            content: []
        };

        function supports_html5_storage() {
            try {
                return 'localStorage' in $window &&
                    $window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }

        function reset() {
            _localStorage && _localStorage.setItem(DOMAIN_NAME, JSON.stringify(domain));
        }

        function init() {
            if (supports_html5_storage()) {
                _localStorage = $window.localStorage;
            } else {
                // fallback localstorage object
                _localStorage = (function () {
                    var _map = {};
                    return {
                        getItem: function (key) {
                            return _map[key];
                        },
                        setItem: function (key, value) {
                            _map[key] = value;
                        }
                    };
                })();
            }

            try {
                var currentDomain = JSON.parse(_localStorage.getItem(DOMAIN_NAME));
                var newVersion = domain.version;
                if ( newVersion.localeCompare(currentDomain.version) === 1) {
                    // current product is newer than the one preserved in localstorage
                    // for now reset (in later versions , migrate)
                    reset();
                }
                // TODO compare dates in order to reset
            } catch (e) {
                console.log('LocalStorage: reseting data ...');
                reset();
            }
        }

        init();

        // Public interface
        return {
            addItem: function (obj, cb) {
                cb = cb || function () {};
                try {
                    var storageObject = JSON.parse(_localStorage.getItem(DOMAIN_NAME));
                    storageObject.content.push(obj);
                    _localStorage.setItem(DOMAIN_NAME, JSON.stringify(storageObject));
                    cb();
                } catch (e) {
                    console.log('[LocalStorageSvc] Error adding item - ' + e);
                    cb(e);
                }
            },
            deleteItem: function (id, cb) {
                cb = cb || function () {};
                try {
                    var storageObject = JSON.parse(_localStorage.getItem(DOMAIN_NAME));
                    storageObject.content = storageObject.content.filter(function (item) {
                        return item.id !== id;
                    });
                    _localStorage.setItem(DOMAIN_NAME, JSON.stringify(storageObject));
                    cb()
                } catch (e) {
                    console.log('[LocalStorageSvc] Error deleting item - ' + e);
                    cb(e);
                }
            },
            getItems: function (cb) {
                cb = cb || function () {};
                try {
                    var storageObject = JSON.parse(_localStorage.getItem(DOMAIN_NAME));
                    cb(null, storageObject.content);
                } catch (e) {
                    console.log('[LocalStorageSvc]: Error getting item - ' + e);
                    cb(e);  
                }
            }
        };
    }
]);
