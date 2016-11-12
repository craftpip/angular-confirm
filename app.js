angular.module('application', ['ngConfirm'])
    .controller('quickFeaturesController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal) {
            $scope.content = 'You\'re ready to proceed!';
            $scope.title = 'Awesome!';
            $scope.alert = function () {
                $ngConfirm({
                    title: 'Alert alert!',
                    icon: 'fa fa-rocket',
                    content: '<div>This is a simple alert <br>with some <strong>HTML</strong> contents</div>',
                    animation: 'scale',
                    buttons: {
                        okay: {
                            class: "btn-blue",
                        }
                    },
                })
            };
            $scope.confirm = function () {
                $ngConfirm({
                    title: 'A secure action',
                    content: 'Its smooth to do multiple confirms at a time. <br> Click confirm or cancel for another modal',
                    icon: 'fa fa-question-circle',
                    animation: 'scale',
                    closeAnimation: 'scale',
                    opacity: 0.5,
                    buttons: {
                        'confirm': {
                            text: 'Proceed',
                            btnClass: 'btn-info',
                            action: function () {
                                $ngConfirm({
                                    title: 'This maybe critical',
                                    content: 'Critical actions can have multiple confirmations like this one.',
                                    icon: 'fa fa-warning',
                                    animation: 'zoom',
                                    closeAnimation: 'zoom',
                                    buttons: {
                                        confirm: {
                                            text: 'Yes, sure!',
                                            btnClass: 'btn-warning',
                                            action: function () {
                                                $.alert('A very critical action <strong>triggered!</strong>');
                                            }
                                        },
                                        cancel: function () {
                                            $.alert('you clicked on <strong>cancel</strong>');
                                        }
                                    }
                                });
                            }
                        },
                        cancel: function () {
                            $ngConfirm('you clicked on <strong>cancel</strong>');
                        },
                        moreButtons: {
                            text: 'something else',
                            action: function () {
                                $ngConfirm('you clicked on <strong>something else</strong>');
                            }
                        },
                    }
                })
            };
            $scope.example1 = function () {
                $ngConfirm({
                    title: $scope.title,
                    alignMiddle: true,
                    contentUrl: 'test.html',
                    escapeKey: true,
                    theme: 'seamless',
                    closeIcon: function () {
                        if (this.closeIconClass == 'fa fa-unlock') {
                            this.closeIconClass = 'fa fa-lock';
                        } else {
                            this.icon = this.closeIconClass = 'fa fa-unlock';
                        }
                        return false;
                    },
                    icon: 'fa fa-check-circle-o',
                    buttons: {
                        white: {
                            text: 'Bigger please!',
                            keys: [],
                            class: 'btn-success',
                            action: function (scope, button) {
                                this.columnClass = 'col-md-6 col-md-offset-3';
                                return false;
                            }
                        },
                        Close: function () {
                        },
                        dark: {
                            keys: [],
                            class: 'btn-default',
                            action: function (scope, button) {
                                this.theme = 'dark';
                                return false;
                            }
                        },
                        material: {
                            keys: [],
                            action: function (scope, button) {
                                this.theme = 'material';
                                return false;
                            }
                        },
                        bootstrap: {
                            keys: [],
                            action: function (scope, button) {
                                this.theme = 'bootstrap';
                                return false;
                            }
                        }
                    },
                    scope: $scope,
                    content: $scope.content,
                    onOpen: function (scope) {
                        scope.data = this;
                    }
                });
            };
        }
    ]);
