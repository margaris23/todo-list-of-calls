var services = angular.module('TodoCalls.services',[]);
services.factory('LocalStorage',['$window', function ($window) {
		console.log('LocalStorage started');

		var _localStorage = $window.localStorage;

		var LocalStorage = {
			get: _localStorage.getItem,
			set: _localStorage.setItem
		};

		return LocalStorage;
	}
]);
