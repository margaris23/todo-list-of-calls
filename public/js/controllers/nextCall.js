var controllers = angular.module('TodoCalls.controllers',[]);

controllers.controller('NextCallCtrl', ['$scope', 'CallSvc', 'PubSubSvc',
        function ($scope, CallSvc, PubSubSvc) {
            console.log('[NextCallCtrl] started');

            function getNextCall() {
                CallSvc.getNextCall(function (call) {
                    $scope.nextcall = call;
                });
            }

            function onEventHandler() {
                console.log('[NextCallCtrl] onEventHandler');
                getNextCall();
            }

            // events && listeners
            $scope.$on('$destroy', function () {
                console.log('[NextCallCtrl] destroyed');
                PubSubSvc.unsubscribe("/call/added", onEventHandler);
                PubSubSvc.unsubscribe("/call/removed", onEventHandler);
            });

            PubSubSvc.subscribe("/call/added", onEventHandler);
            PubSubSvc.subscribe("/call/removed", onEventHandler);

            // Initialization
            $scope.nextcall = null;

            getNextCall();
        }
    ]);
