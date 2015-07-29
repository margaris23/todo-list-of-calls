services.factory('CallSvc', ['LocalStorage', function (LocalStorage) {
    console.log('CallSvc started');

    var ITEMS_PER_PAGE = 10;
    var TIME_PATTERN = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    // List of calls: initialize with content from storage
    var _calls = [];

    function getCalls (cb) {
        LocalStorage.getItems(cb);
    }

    function validate (call) {
        return true;
    }

    // Initialization
    getCalls(function (error, reply) {
        if (reply) {
            _calls = reply;
            return;
        }

        error && console.log('CallSvc: error getting calls. reseting...');
    });

    return {
        getCalls: getCalls,
        addCall: function (call, cb) {
            cb = cb || function () {};
            if (!validate(call)) {
                cb('Invalid data');
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
                cb(error);
            });
        },
        getNextCall: function (cb) {
            cb = cb || function () {};
            // get current time in hh:mm format
            var now = new Date().toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");

            var nextCallTime = "23:59";
            var nextCall = null;
            _calls.forEach(function (call) {
                // if now < call < next  then next = call
                if ( now.localeCompare(call.time) === -1 &&
                    nextCallTime.localeCompare(call.time) === 1) {
                    nextCall = call;
                    nextCallTime = call.time;
                }
            });
            cb(nextCall);
        },
        TIME_PATTERN: TIME_PATTERN,
        ITEMS_PER_PAGE: ITEMS_PER_PAGE
    };
}]);

