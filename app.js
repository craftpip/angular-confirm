angular.module('application', ['ngConfirm'])
    .controller('main', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal) {
            $scope.content = 'You\'re ready to proceed!';
            $scope.title = 'Awesome!';
            $scope.asd = function () {
                $ngConfirmGlobal.closeAll();
            };
            $scope.example1 = function () {
                $ngConfirm({
                    title: $scope.title,
                    alignMiddle: true,
                    contentUrl: 'test.html',
                    escapeKey: true,
                    theme: 'seamless',
                    closeIcon: function(){
                        if(this.closeIconClass == 'fa fa-unlock'){
                            this.closeIconClass = 'fa fa-lock';
                        }else{
                            this.closeIconClass = 'fa fa-unlock';
                        }
                        return false;
                    },
                    icon: 'fa fa-check-circle-o',
                    buttons: {
                        white: {
                            text: 'Start CODING',
                            keys: [],
                            class: 'btn-success',
                            action: function (scope, button) {
                                this.theme = 'white';
                                return false;
                            }
                        },
                        //dark: {
                        //    keys: [],
                        //    class: 'btn-default',
                        //    action: function (scope, button) {
                        //        this.theme = 'dark';
                        //        return false;
                        //    }
                        //},
                        //material: {
                        //    keys: [],
                        //    action: function (scope, button) {
                        //        this.theme = 'material';
                        //        return false;
                        //    }
                        //},
                        //bootstrap: {
                        //    keys: [],
                        //    action: function (scope, button) {
                        //        this.theme = 'bootstrap';
                        //        return false;
                        //    }
                        //}
                    },
                    scope: $scope,
                    content: $scope.content,
                    onOpen: function(scope){
                        scope.data = this;
                    }
                });
            };
        }
    ]);
