angular.module('application', ['ngConfirm'])
    .controller('main', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults) {
            $scope.something = 'asdasd';
            $scope.title = 'something';
            $scope.text = '<strong>{{something}}</strong> ' +
                '<input type="text" ng-model="something" />' +
                '<input type="text" ng-model="parent.title" />';


            $scope.example1 = function(){
                var ngConfirmObj = $ngConfirm({
                    //contentUrl: 'readme.md',
                    buttons: {
                        hey: {
                            action: function (scope, button) {
                                this.setTheme('black');
                                button.text = 'heyasdsad';
                                button.class = 'btn btn-danger';
                                scope.parent.title = 'Something right ?';
                            }
                        },
                        hey2: function (scope, button) {
                            this.setTheme('black');
                            button.text = 'heyasdsad';
                            button.class = 'btn btn-danger';
                        },
                    },
                    scope: $scope,
                    content: $scope.text,
                });
            };


            //ngConfirmObj.scope // the local scope.
            //ngConfirmObj.parent // the angular confirm scope.
            //
            //$interval(function(){
            //    ngConfirmObj.title += 'a';
            //}, 1000);
        }
    ]);