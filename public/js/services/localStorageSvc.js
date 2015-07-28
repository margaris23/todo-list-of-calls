var services = angular.module('TodoCalls.services',[]);
services.factory('LocalStorage',['$window', function ($window) {
		console.log('LocalStorage started');

		var _localStorage = null;

		if (supports_html5_storage()) {
			_localStorage = $window.localStorage;
		} else {
			// fallback localstorage
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

		function reset() {
			_localStorage.setItem('todo-calls', []);
		}

		function supports_html5_storage() {
			try {
				return 'localStorage' in $window &&
					$window['localStorage'] !== null;
			} catch (e) {
				return false;
			}
		}

		// Initialization
		reset();

		return _localStorage;
	}
]);
