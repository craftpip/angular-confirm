angular.module('application', ['ngConfirm'])
    .controller('quickFeaturesController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
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
                                                $ngConfirm('A very critical action <strong>triggered!</strong>');
                                            }
                                        },
                                        cancel: function () {
                                            $ngConfirm('you clicked on <strong>cancel</strong>');
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

            $scope.type = function () {
                $ngConfirm({
                    title: 'Oh no',
                    content: '<p>Something bad, bad happened.</p>' +
                    'Select the alert type:' +
                    ' <div class="form-group">' +
                    '<select class="form-control" ng-model="ngc.type">' +
                    '<option value="default">Default</option>' +
                    '<option value="red">Red</option>' +
                    '<option value="blue">Blue</option>' +
                    '<option value="green">Green</option>' +
                    '<option value="purple">Purple</option>' +
                    '<option value="dark">Dark</option>' +
                    '</select>' +
                    '<div class="checkbox"><label><input type="checkbox" ng-model="ngc.typeAnimated"> Animated</label></div>' +
                    '</div>',
                    type: 'red',
                    typeAnimated: true,
                    buttons: {
                        ok: function () {
                        }
                    },
                    onContentReady: function ($scope) {

                    }
                })
            };
            $scope.prompt = function () {
                $ngConfirm({
                    title: 'A simple form',
                    contentUrl: 'form.html',
                    buttons: {
                        sayMyName: {
                            text: 'Say my name',
                            btnClass: 'btn-orange',
                            action: function ($scope) {
                                if (!$scope.username) {
                                    this.buttons.sayMyName.text = 'Please enter a valid name';
                                    $scope.error = 'Please don\'t keep the name field empty!';
                                    var that = this;
                                    $timeout(function () {
                                        that.buttons.sayMyName.text = 'Say my name again';
                                    }, 1000);
                                    return false;
                                }
                                $ngConfirm('Hello <strong>' + $scope.username + '</strong>, i hope you have a great day!');
                            }
                        },
                        later: function () {
                        }
                    },
                    onContentReady: function ($scope) {

                    }
                })
            };
            $scope.dialog = function () {
                $ngConfirm({
                    title: 'Title comes here.',
                    content: '' +
                    '<div ng-if="!altContent">Just need a popup without buttons, <strong>no problem!</strong><br>' +
                    '<h3>disable the buttons</h3>' +
                    '<h4><strong>and you get a dialog modal</strong></h4>' +
                    '<h5><em>Well, that close icon is shown if no buttons are here (u need something to close the modal right), u can explicitly control that too.</em></h5>' +
                    '<button type="button" ng-click="changeContent()" class="btn btn-success">Click me to change the content</button>' +
                    '</div>' +
                    '<div ng-if="altContent">As simple as that!</div>',
                    onOpen: function ($scope) {
                        $scope.changeContent = function () {
                            $scope.altContent = true;
                        }
                    },
                })
            };
            $scope.bgDismiss = function () {
                $ngConfirm({
                    title: 'Background dismiss',
                    content: 'Click outside the modal to close it.',
                    animation: 'top',
                    closeAnimation: 'bottom',
                    backgroundDismiss: true,
                    buttons: {
                        ok: {
                            text: 'okay',
                            btnClass: 'btn-blue',
                            action: function () {
                                // do nothing
                            }
                        }
                    }
                })
            };
            $scope.asyncContent = function () {
                $ngConfirm({
                    title: 'Asynchronous content',
                    contentUrl: 'table.html',
                    columnClass: 'medium', // to make the width wider.
                    animation: 'zoom',
                    backgroundDismiss: true,
                })
            };
            $scope.autoClose = function () {
                $ngConfirm({
                    title: 'Auto close',
                    content: 'Some actions maybe critical, prevent it with the Auto close. This dialog will automatically trigger cancel after the timer runs out.',
                    autoClose: 'cancelAction|10000',
                    escapeKey: 'cancelAction',
                    buttons: {
                        confirm: {
                            btnClass: 'btn-danger',
                            text: 'Delete ben\'s account',
                            action: function () {
                                $ngConfirm('You deleted Ben\'s account!');
                            }
                        },
                        cancelAction: {
                            text: 'Cancel',
                            action: function () {
                                $ngConfirm('Ben just got saved!');
                            }
                        }
                    }
                });
            };
            $scope.keyStrokes = function () {
                $ngConfirm({
                    title: 'Keystrokes',
                    escapeKey: true, // close the modal when escape is pressed.
                    content: 'Press the <strong>escape key</strong> to close the modal. That works.' +
                    '<br> press <strong>enter key</strong> to trigger okay.' +
                    '<br> press <strong>shift or ctrl key</strong> to trigger cancel.',
                    backgroundDismiss: true, // for escapeKey to work, backgroundDismiss should be enabled.
                    buttons: {
                        okay: {
                            keys: [
                                'enter'
                            ],
                            action: function () {
                                $ngConfirm('<strong>Okay button</strong> was triggered.');
                            }
                        },
                        cancel: {
                            keys: [
                                'ctrl',
                                'shift'
                            ],
                            action: function () {
                                $ngConfirm('<strong>Cancel button</strong> was triggered.');
                            }
                        }
                    }
                });
            };
            $scope.centerAlign = function () {
                $ngConfirm({
                    title: 'Gracefully center aligned',
                    content: '<p>You can add content and not worry about the alignment. The goal is to make a Interactive dialog!.</p>' +
                    '<button ng-click="addContent()" type="button" class="btn btn-success">Click me to add more content</button> <div ng-repeat="a in content track by $index">{{a}}</div> ',
                    confirmButtonClass: 'btn-primary',
                    buttons: {
                        someButton: {
                            text: 'Add wow',
                            btnClass: 'btn-success',
                            action: function ($scope) {
                                $scope.content.push('Woowww');
                                return false; // prevent dialog from closing.
                            }
                        },
                        someOtherButton: {
                            text: 'Clear it',
                            btnClass: 'btn-warning',
                            action: function ($scope) {
                                $scope.content = [];
                                return false; // prevent dialog from closing.
                            }
                        },
                        close: function () {
                            // lets the user close the modal.
                        }
                    },
                    onOpen: function ($scope) {
                        $scope.content = [];
                        $scope.addContent = function () {
                            $scope.content.push('This is awesome!!!!');
                        };
                    },
                })
            };
            $scope.imageLoading = function () {
                $ngConfirm({
                    title: 'Adding images',
                    content: 'Images from flickr <br>' +
                    '<div ng-repeat="image in images"><img ng-src="{{image}}"></div>',
                    animation: 'zoom',
                    animationClose: 'top',
                    buttons: {
                        confirm: {
                            text: 'Add more',
                            class: 'btn-primary',
                            action: function ($scope) {
                                $scope.images.push('https://c2.staticflickr.com/6/5248/5240523362_8d6d315391_b.jpg');
                                return false; // prevent dialog from closing.
                            }
                        },
                        cancel: function () {
                            // lets the user close the modal.
                        }
                    },
                    onOpen: function($scope){
                        $scope.images = ['https://c2.staticflickr.com/4/3891/14354989289_2eec0ba724_b.jpg'];
                    }
                });
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
