services.factory('CallSvc', ['LocalStorage', 'PubSubSvc', function (LocalStorage, PubSubSvc) {
    console.log('CallSvc started');

    var ITEMS_PER_PAGE = 10;
    var TIME_PATTERN = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    // List of calls: initialize with content from storage
    var _calls = [];

    var _nextCall = null;

    function getCalls (cb) {
        LocalStorage.getItems(function (error, reply) {
            cb = cb || function () {};

            if (error || !reply) {
                cb(error, reply);
                return;
            }

            // cache calls
            _calls = reply;

            // get current time in hh:mm format
            var now = new Date().toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");

            var nextCallTime = "23:59";
            var nextCall = null;

            _calls.forEach(function (call) {
                // if now < call < next  then next = call
                var diff = now.localeCompare(call.time);
                if (diff === 1) {
                    call.isComplete = true;
                } else if ( diff === -1 &&
                    nextCallTime.localeCompare(call.time) === 1) {
                    nextCall = call;
                    nextCallTime = call.time;
                }
            });

            //cache next call
            _nextCall = nextCall;

            cb(error, _calls);
        });
    }

    function validate (call, cb) {
        if (!call || !call.name || !call.phone || !call.time) {
            cb && cb(Common.INVALID_DATA);
            return false;
        }

        var phone = call.phone;
        // TODO fix regex
        if (!/^00[0-9]{3} [0-9]{3} [0-9]{3}/.exec(call.phone)) {
            cb && cb(Common.INVALID_PHONE);
            return false;
        }

        // convert phone
        call.phone = phone.replace(/^\+/, '00').replace(/[\(|\)]/g, '');

        return true;
    }

    // Initialization
    getCalls(function (error, reply) {
        if (reply) {
            _calls = reply;
            PubSubSvc.publish("/calls/loaded");
            return;
        }

        error && console.log('CallSvc: error getting calls. reseting...');
    });

    return {
        getCalls: getCalls,
        addCall: function (call, cb) {
            cb = cb || function () {};
            if (!validate(call, cb)) {
                return;
            }

            LocalStorage.addItem(call, function (error) {
                if (error) {
                    console.log('Error adding call - ' + error);
                    cb(error);
                    return;
                }
                // on success add it to cache
                _calls.push(call);
                PubSubSvc.publish("/call/added");
                cb();
            });
        },
        deleteCall: function (id, cb) {
            cb = cb || function () {};
            LocalStorage.deleteItem(id, function (error) {
                // Remove calls from cache on success
                if(!error){
                    _calls = _calls.filter(function (call) {
                        return call.id !== id; 
                    });
                }
                PubSubSvc.publish("/call/removed");
                cb(error);
            });
        },
        getNextCall: function (cb) {
            getCalls();
            cb && cb(_nextCall);
        },
        TIME_PATTERN: TIME_PATTERN,
        ITEMS_PER_PAGE: ITEMS_PER_PAGE
    };
}]);

