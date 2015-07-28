controllers.controller('CallsCtrl',
	['$scope', 'CallSvc',
		function ($scope, CallSvc) {
			console.log('CallsCtrl started');

			// interface
			$scope.addCall = function () {
				CallSvc.addCall($scope.call, function (err) {
					error && console.log('Error creating new call' + err);
				});
			};

			// Events
			$scope.$on('$destroy', function () {
				console.log('CallsCtrl destroyed');
			});

			// Initialization
			$scope.calls = [];
			$scope.call = new Call();

			CallSvc.getCalls(function (err,reply) {
				if (err) {
					console.log('Error getting listof calls: ' + err);
					return;
				}
				$scope.calls = reply;
			});
		}
	]);
