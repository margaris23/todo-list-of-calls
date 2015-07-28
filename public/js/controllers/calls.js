controllers.controller('CallsCtrl',
	['$scope', 'CallSvc',
		function ($scope, CallSvc) {
			console.log('CallsCtrl started');

			$scope.$on('$destroy', function () {
				console.log('CallsCtrl destroyed');
			});

			// Initialization
			$scope.calls = [];

			CallSvc.getCalls(function (err,reply) {
				if (err) {
					console.log('Error getting listof calls: ' + err);
					return;
				}
				$scope.calls = reply;
			});
		}
	]);
