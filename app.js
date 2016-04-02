angular.module('application', ['ngConfirm'])
    .controller('main', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal) {
            $scope.something = 'asdasd';
            $scope.title = 'something';
            $scope.asd = function(){
                $ngConfirmGlobal.closeAll();
            };
            $scope.example1 = function () {
                $ngConfirm({
                    title: $scope.title,
                    alignMiddle: true,
                    contentUrl: 'test.html',
                    autoClose: 'material|2000',
                    buttons: {
                        white: function (scope, button) {
                            this.theme = 'white';
                            this.title = 'The original one!';
                            return false;
                        },
                        dark: function (scope, button) {
                            this.theme = 'dark';
                            this.title = 'The dark one!';
                            return false;
                        },
                        material: function (scope, button) {
                            this.theme = 'material';
                            this.title = 'I trasdased';
                            this.columnClass = 'col-md-8 col-md-offset-2';
                            return false;
                        },
                        bootstrap: function (scope, button) {
                            this.theme = 'bootstrap';
                            this.title = 'I tried';
                            return false;
                        },
                        supervan: function (scope, button) {
                            this.theme = 'supervan';
                            this.title = 'Something random';
                            $ngConfirm('wow', 'asd');
                            return false;
                        }
                    },
                    scope: $scope,
                    content: $scope.text,
                });
            };
        }
    ]);
