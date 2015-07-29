services.factory('PubSubSvc', function () {
    console.log('PubSubSvc started');

    var _subscriptions = {};

    return {
        subscribe: function (event, fn) {
            var subs = _subscriptions[event];
            if (!subs) {
                subs = [fn];
            } else {
                subs.push(fn);
            }
            _subscriptions[event] = subs;
        },
        unsubscribe: function (event, fn) {
            var subs = _subscriptions[event];
            if (!subs) {
                _subscriptions[event] = [];
            } else {
                _subscriptions[event] = subs.filter(function (_fn) {
                    return fn !== _fn;
                });
            }
        },
        publish: function (event) {

        }
    };
});