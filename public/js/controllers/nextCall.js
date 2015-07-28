var controllers = angular.module('TodoCalls.controllers',[]);

controllers.controller('NextCallCtrl',
	['$scope', 'CallSvc',
		function ($scope, CallSvc) {
		  	console.log('NextCallCtrl started');
		}
	]);
