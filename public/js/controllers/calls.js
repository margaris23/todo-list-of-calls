controllers.controller('CallsCtrl',
    ['$scope', 'CallSvc',
        function ($scope, CallSvc) {
            console.log('CallsCtrl started');

            function getCalls() {
                CallSvc.getCalls(function (error, reply) {
                    if (error) {
                        console.log('Error getting listof calls: ' + error);
                        return;
                    }
                    $scope.calls = reply;
                });
            }

            // Public interface
            $scope.addCall = function () {
                CallSvc.addCall($scope.call, function (error) {
                    if (!error) {
                        // reset call object
                        $scope.call = new Call();
                        // retrieve calls: TODO create pubsubsvc
                        getCalls();
                        return;
                    }
                    console.log('Error creating new call: ' + error);
                });
            };

            $scope.deleteCall = function (call) {    
                call && CallSvc.deleteCall(call.id, function (error) {
                    if (!error) {
                        getCalls();
                        return;
                    }
                    console.log('CallsCtrl: call could not be deleted: ' + error);
                });
            };

            $scope.timePattern = CallSvc.TIME_PATTERN;

            // Events
            $scope.$on('$destroy', function () {
                console.log('CallsCtrl destroyed');
            });

            // Initialization
            $scope.calls = [];
            $scope.call = new Call();

            getCalls();
        }
    ]);
