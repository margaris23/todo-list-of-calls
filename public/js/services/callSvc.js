services.factory('CallSvc', ['LocalStorage', function (LocalStorage) {
	console.log('CallSvc started');

	var _calls = {};

	var callAPI = {
		getCalls: function (cb) {
			cb = cb || function() {};
			cb('Not implemented');
		},
		addCall: function (name, phone, time, cb) {
			cb = cb || function() {};
			cb('Not implemented');
		}
	};

	return callAPI;
}]);

