var controllers = angular.module('TodoCalls.controllers',[]);

controllers.controller('NextCallCtrl', ['$scope', 'CallSvc',
		function ($scope, CallSvc) {
		  	console.log('NextCallCtrl started');

		  	// Initialization
		  	$scope.nextcall = null;

		  	CallSvc.getNextCall(function (call) {
		  		if (!call) {
		  			console.log('Error getting next or no call!');
		  			return;
		  		}
		  		$scope.nextcall = call;
		  	});
		}
	]);
