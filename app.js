angular.module('application', ['cp.ngConfirm'])
    .run([
        '$ngConfirmDefaults',
        function ($ngConfirmDefaults) {
            // modify the defaults here.
            // $ngConfirmDefaults.theme = 'modern';
        }
    ])
    .controller('quickFeaturesController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.materialTheme = function () {
                $ngConfirm({
                    title: 'Alert',
                    icon: 'fa fa-info-circle',
                    theme: 'material',
                    content: '<div>Inspirations taken from Google\'s material design.' +
                    '</div>',
                    animation: 'scale',
                    type: 'purple',
                    closeAnimation: 'scale',
                    buttons: {
                        ok: {
                            btnClass: "btn-blue",
                        },
                        close: function () {
                            
                        }
                    },
                })
            };
            $scope.modernTheme = function () {
                $ngConfirm({
                    title: 'Alert',
                    icon: 'fa fa-info-circle',
                    theme: 'modern',
                    type: 'blue',
                    content: '<div class="text-center">This theme meets the trend of the internet.' +
                    '</div>',
                    animation: 'scale',
                    closeAnimation: 'scale',
                    buttons: {
                        ok: {
                            btnClass: "btn-blue",
                        },
                        close: function () {

                        }
                    },
                })
            };
            $scope.supervanTheme = function () {
                $ngConfirm({
                    title: 'Alert',
                    icon: 'fa fa-info-circle',
                    theme: 'supervan',
                    content: '<div class="text-center">I was inspired from tumblr for this. <br>' +
                    'A dialog that\'s free of bounds, try this one out in the themes page with different type colors.' +
                    '</div>',
                    animation: 'scale',
                    closeAnimation: 'scale',
                    buttons: {
                        ok: {
                            btnClass: "btn-blue",
                        },
                        close: function () {

                        }
                    },
                })
            };
            $scope.alert = function () {
                $ngConfirm({
                    title: 'Alert alert!',
                    icon: 'fa fa-rocket',
                    content: '<div>This is a simple alert <br>with some <strong>HTML</strong> contents</div>',
                    animation: 'scale',
                    buttons: {
                        okay: {
                            btnClass: "btn-blue",
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
                    onOpen: function ($scope) {
                        $scope.images = ['https://c2.staticflickr.com/4/3891/14354989289_2eec0ba724_b.jpg'];
                    }
                });
            };
            $scope.title = 'Seamless theme!';
            $scope.videos = function () {
                $ngConfirm({
                    title: $scope.title,
                    content: '<p> Seamless borders for images or videos!</p> <div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/4kHl4FoK1Ys"></iframe></div>',
                    theme: 'seamless',
                    icon: 'fa fa-check-circle-o',
                    buttons: {
                        white: {
                            text: 'Increase size',
                            btnClass: 'btn-green',
                            action: function (scope, button) {
                                this.columnClass = 'medium';
                                button.disabled = true;
                                return false;
                            }
                        },
                        close: function () {
                        },
                    },
                    onOpen: function (scope) {
                        scope.data = this;
                    }
                });
            };
        }
    ])
    .controller('quickUseController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.test = function () {
                $scope.name = 'Sia: cheap thrills';
                $ngConfirm({
                    title: 'Title here',
                    content: '<strong>{{name}}</strong> is my favourite song',
                    scope: $scope,
                    buttons: {
                        sayBoo: {
                            text: 'Say Booo',
                            btnClass: 'btn-blue',
                            action: function ($scope) {
                                $scope.name = 'Booo!!';
                                return false; // prevent close;
                            }
                        },
                        somethingElse: {
                            text: 'Something else',
                            btnClass: 'btn-orange',
                            action: function ($scope) {
                                $ngConfirm('You clicked on <strong>something else</strong>');
                            }
                        },
                        close: function () {
                        }
                    }
                });
            }
        }
    ])
    .controller('buttonController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.buttonText = function () {
                $ngConfirm({
                    buttons: {
                        something: function () {
                            // here the key 'something' will be used as the text.
                            $ngConfirm('You clicked on something.');
                        },
                        somethingElse: {
                            text: 'Something else &*', // Some Non-Alphanumeric characters
                            action: function () {
                                $ngConfirm('You clicked on something else');
                            }
                        }
                    }
                });
            };
            $scope.usingNgConfirmButtons = function () {
                $ngConfirm({
                    buttons: {
                        default: {
                            btnClass: 'btn-default',
                        },
                        blue: {
                            btnClass: 'btn-blue',
                        },
                        green: {
                            btnClass: 'btn-green',
                        },
                        red: {
                            btnClass: 'btn-red',
                        },
                        orange: {
                            btnClass: 'btn-orange',
                        },
                        purple: {
                            btnClass: 'btn-purple',
                        },
                        dark: {
                            btnClass: 'btn-dark',
                        },
                    }
                })
            };
            $scope.usingBootstrapButtons = function () {
                $ngConfirm({
                    buttons: {
                        default: {
                            btnClass: 'btn-default',
                        },
                        info: {
                            btnClass: 'btn-info',
                        },
                        success: {
                            btnClass: 'btn-success custom-class',
                        },
                        danger: {
                            btnClass: 'btn-danger custom-class',
                        },
                        warning: {
                            btnClass: 'btn-warning',
                        },
                    }
                })
            };
            $scope.buttonKeys = function () {
                $ngConfirm({
                    buttons: {
                        specialKey: {
                            text: 'On behalf of shift',
                            keys: ['shift', 'alt'],
                            action: function () {
                                $ngConfirm('Shift or Alt was pressed');
                            }
                        },
                        alphabet: {
                            text: 'A, B',
                            keys: ['a', 'b'],
                            action: function () {
                                $ngConfirm('A or B was pressed');
                            }
                        }
                    }
                });
            };
            $scope.buttonKeysExample = function () {
                $ngConfirm({
                    title: false,
                    content: 'A very very critical action here! <br> ' +
                    'the proceed button is hidden.' +
                    'The only way to proceed is to press the <strong>Y</strong> key.<br>' +
                    'Press <span style="font-size: 20px;">Y</span> to proceed.',
                    buttons: {
                        yes: {
                            show: false,
                            keys: ['y'],
                            action: function ($scope, button) {
                                $ngConfirm('Critical action <strong>was performed</strong>.');
                            }
                        },
                        no: {
                            keys: ['N'],
                            action: function ($scope, button) {
                                $ngConfirm('You clicked No.');
                            }
                        },
                    }
                });
            };
            $scope.buttonProperties = function () {
                $ngConfirm({
                    buttons: {
                        buttonA: {
                            text: 'button a',
                            action: function ($scope, button) {
                                button.text = 'Oh yeah'; // the current button
                                this.buttons.buttonB.text = 'Changed it!';
                                return false;
                            }
                        },
                        buttonB: {
                            text: 'button b',
                            action: function ($scope, button) {
                                this.buttons.buttonA.disabled = true;
                                return false;
                            }
                        },
                        reset: function ($scope, button) {
                            this.buttons.buttonA.disabled = false;
                            this.buttons.buttonA.text = 'button a';
                            this.buttons.buttonB.text = 'button b';
                            return false;
                        }
                    },
                    closeIcon: true, // let the user close the modal
                });
            }
        }
    ])
    .controller('customizationController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.errorDialog = function () {
                $ngConfirm({
                    title: 'Encountered an error!',
                    type: 'red',
                    content: 'Something went downhill, this may be serious',
                    buttons: {
                        tryAgain: {
                            text: 'Try again',
                            btnClass: 'btn-red',
                            action: function () {

                            }
                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.errorDialogNoAnimation = function () {
                $ngConfirm({
                    title: 'Encountered an error!',
                    type: 'red',
                    typeAnimation: false,
                    content: 'Something went downhill, this may be serious',
                    buttons: {
                        tryAgain: {
                            text: 'Try again',
                            btnClass: 'btn-red',
                            action: function () {

                            }
                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.successDialog = function () {
                $ngConfirm({
                    title: 'Congratulations!',
                    type: 'green',
                    content: 'Consider something great happened, and you have to show a positive message',
                    buttons: {
                        thankYou: {
                            text: 'Thank you',
                            btnClass: 'btn-green',
                            action: function () {

                            }
                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.dialogType = function (color) {
                $ngConfirm({
                    title: color + '!',
                    type: color,
                    content: 'Some content here.',
                    buttons: {
                        ok: function () {

                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.iconFA = function () {
                $ngConfirm({
                    text: 'font-awesome',
                    icon: 'fa fa-warning',
                    buttons: {
                        ok: function () {

                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.iconAnimatedFA = function () {
                $ngConfirm({
                    text: 'Working!',
                    icon: 'fa fa-spinner fa-spin',
                    content: 'Sit back, we are processing your request!',
                    buttons: {
                        ok: function () {

                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.closeIcon = function () {
                $ngConfirm({
                    closeIcon: true,
                    buttons: {
                        ok: function () {

                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.closeIconFa = function () {
                $ngConfirm({
                    closeIcon: true,
                    closeIconClass: 'fa fa-close',
                    buttons: {
                        ok: function () {

                        },
                        close: function () {

                        }
                    }
                })
            };
            $scope.closeIconCallback = function () {
                $ngConfirm({
                    closeIcon: function () {
                        return 'aRandomButton'; // set a button handler, 'aRandomButton' prevents close.
                    },
                    // or
                    // closeIcon: 'aRandomButton', // set a button handler
                    buttons: {
                        aRandomButton: function () {
                            $ngConfirm('A random button is called, and i prevent closing the modal');
                            return false; // you shall not pass
                        },
                        close: function () {
                        }
                    }
                })
            };
            $scope.columnClass = function (className, fluid) {
                fluid = fluid || false;
                $ngConfirm({
                    columnClass: className,
                    containerFluid: fluid,
                })
            };
            $scope.boxWidth = function (width) {
                $ngConfirm({
                    useBootstrap: false,
                    boxWidth: width,
                });
            }
        }
    ])
    .controller('autoCloseController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.deleteUser = function () {
                $ngConfirm({
                    title: 'Delete user?',
                    content: 'This dialog will automatically trigger \'cancel\' in 6 seconds if you don\'t respond.',
                    autoClose: 'cancel|8000',
                    buttons: {
                        deleteUser: {
                            text: 'delete user',
                            btnClass: 'btn-red',
                            action: function () {
                                $ngConfirm('Deleted the user!');
                            }
                        },
                        cancel: function () {
                            $ngConfirm('action is canceled');
                        }
                    }
                });
            };
            $scope.logoutMyself = function () {
                $ngConfirm({
                    title: 'Logout?',
                    content: 'Your time is out, you will be automatically logged out in 10 seconds.',
                    autoClose: 'logoutUser|10000',
                    buttons: {
                        logoutUser: {
                            text: 'logout myself',
                            btnClass: 'btn-green',
                            action: function () {
                                $ngConfirm('The user was logged out');
                            }
                        },
                        cancel: function () {
                            $ngConfirm('canceled');
                        }
                    }
                });
            };
        }
    ])
    .controller('bgDismissController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.allowBgDismiss = function () {
                $ngConfirm({
                    backgroundDismiss: 'buttonName',
                    content: 'Click outside the box to close the modal',
                    buttons: {
                        buttonName: function () {
                            $ngConfirm('Button name was clicked');
                        },
                        close: function () {
                        }
                    }
                });
            };
            $scope.bgDismissAnimation = function (animationName) {
                $ngConfirm({
                    backgroundDismiss: false,
                    backgroundDismissAnimation: animationName,
                    buttons: {
                        ok: function () {
                        }
                    }
                });
            };
        }
    ])
    .controller('escapeKeyController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.escapeKey = function () {
                $ngConfirm({
                    content: 'background dismiss is not allowed on this modal, thus the modal will make a backgroundDismissAnimation',
                    escapeKey: true,
                    backgroundDismiss: false,
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
            $scope.escapeKeyHandler = function () {
                $ngConfirm({
                    escapeKey: 'buttonName',
                    buttons: {
                        buttonName: function () {
                            $ngConfirm('Button name was called');
                        },
                        close: function () {

                        }
                    }
                });
            };
        }
    ])
    .controller('rtlController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.rtl = function () {
                $ngConfirm({
                    title: 'پیغام',
                    content: 'این یک متن به زبان شیرین فارسی است',
                    rtl: true,
                    closeIcon: true,
                    buttons: {
                        confirm: {
                            text: 'تایید',
                            btnClass: 'btn-blue',
                            action: function () {
                                $ngConfirm('تایید شد.');
                            }
                        },
                        cancel: {
                            text: 'انصراف',
                            action: function () {

                            }
                        }
                    }
                });
            };
        }
    ])
    .controller('callbackController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.callback = function () {
                $ngConfirm({
                    title: false,
                    contentUrl: 'callback.html',
                    onReady: function ($scope) {
                        // when content is fetched & the modal is open
                        alert('onReady');
                        var self = this;
                        this.buttons.ok.disabled = true;
                        $scope.fnClick = function () {
                            $scope.name = 'Chuck norris';
                            self.buttons.ok.disabled = false;
                        };
                    },
                    onOpenBefore: function () {
                        // before the modal is displayed.
                        alert('onOpenBefore');
                    },
                    onOpen: function () {
                        // after the modal is displayed.
                        alert('onOpen');
                    },
                    onClose: function () {
                        // before the modal is hidden.
                        alert('onClose');
                    },
                    onDestroy: function () {
                        // when the modal is removed from DOM
                        alert('onDestroy');
                    },
                    onAction: function ($scope, btnName) {
                        // when a button is clicked, with the button name
                        alert('onAction: ' + btnName);
                    },
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
        }
    ])
    .controller('openCloseAnimationController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.animation = function (animationName) {
                $ngConfirm({
                    animation: animationName,
                    closeAnimation: animationName,
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
            $scope.bounce = function (bounceRate) {
                $ngConfirm({
                    animationBounce: bounceRate,
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
            $scope.speed = function (speed) {
                $ngConfirm({
                    animationSpeed: speed,
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
            $scope.bgDismissAnimation = function (animationName) {
                $ngConfirm({
                    backgroundDismiss: false,
                    backgroundDismissAnimation: animationName,
                    buttons: {
                        ok: function () {

                        }
                    }
                });
            };
        }
    ])
    .controller('themesController', [
        '$scope',
        '$ngConfirm',
        '$interval',
        '$ngConfirmDefaults',
        '$ngConfirmGlobal',
        '$timeout',
        function ($scope, $ngConfirm, $interval, $ngConfirmDefaults, $ngConfirmGlobal, $timeout) {
            $scope.theme = function (themeName) {
                $ngConfirm({
                    icon: 'fa fa-check-circle',
                    theme: themeName,
                    contentUrl: 'themes_popup.html',
                    closeIcon: true,
                    buttons: {
                        default: {
                            btnClass: 'btn-default',
                        },
                        blue: {
                            btnClass: 'btn-blue',
                        },
                        green: {
                            btnClass: 'btn-green',
                        },
                        red: {
                            btnClass: 'btn-red',
                        },
                        orange: {
                            btnClass: 'btn-orange',
                        },
                    },
                    onOpen: function ($scope) {
                        var that = this;
                        $scope.showLoading = function () {
                            that.loading(true);
                            $timeout(function () {
                                that.loading(false);
                            }, 2000)
                        }
                    }
                });
            };
        }
    ]);




















