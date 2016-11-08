/*!
 * angular-confirm v1.0.0 (http://craftpip.github.io/angular-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2015 angular-confirm
 * Licensed under MIT (https://github.com/craftpip/angular-confirm/blob/master/LICENSE)
 */

/*
 * TODO:
 * Animations,
 * Auto close,
 * Keyboard events,
 * Testing,
 * Documentation.
 */
"use strict";

if (typeof jQuery === 'undefined')
    throw new Error('angular-confirm requires jQuery');
if (typeof angular === 'undefined')
    throw new Error('angular-confirm requires Angular');

try { angular.module('ngSanitize')} catch (e) {
    throw new Error('angular-confirm requires ngSanitize: https://docs.angularjs.org/api/ngSanitize');
}
angular.module('ngConfirm', [
        'ngSanitize',
    ])
    .service('$ngConfirmTemplate', function () {
        var template = '<div class="ng-confirm" ng-class="[data.theme, {rtl: data.rtl}]" aria-labelledby="{{aria}}" tabindex="-1">' +
            '<div class="ng-confirm-bg" ng-class="{\'ng-confirm-loading\': data.bgLoading}" ng-style="data.bg_style"></div>' +
            '<div class="ng-confirm-scrollpane" ng-click="data._scrollPaneClick()">' +
            '<div class="container">' +
            '<div class="row">' +
            '<div class="ng-confirm-box-container" ng-class="data.columnClass">' +
            '<div class="ng-confirm-box" ng-show="data.show" ng-click="data._ngBoxClick()" ng-style="data.box_style" ng-class="{loading: data.showLoading, hilight: data.hilight }" role="dialog" aria-labelledby="labelled" tabindex="-1">' +
            '<div class="closeIcon" ng-show="data.closeIcon" ng-click="data._closeClick()"><span ng-if="!data.closeIconClass">&times;</span><i ng-class="data.closeIconClass" ng-if="data.closeIconClass"></i></div>' +
            '<div class="title-c">' +
            '<span class="icon-c"><i ng-if="data.icon" ng-class="data.icon"></i></span>' +
            '<span class="title" ng-show="data.title">{{data.title}}</span>' +
            '</div>' +
            '<div class="content-pane" ng-style="data.contentPane_style">' +
            '<div class="content" ng-style="data.content_style"></div>' +
            '</div>' +
            '<div class="buttons">' +
            '<button type="button" ng-repeat="(key, button) in data.buttons" ng-click="data.trigger(key)" class="btn" ng-class="button.class">{{button.text}}<span ng-show="button.timer"> ({{button.timer}})</span></button>' +
            '</div>' +
            '<div class="jquery-clear">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '';

        return {default: template};
    })
    .service('$ngConfirmAnimations', function () {
        return {
            'global': { // will be used in all of the below animations.
                in: {
                    'opacity': 0,
                },
                out: {
                    'opacity': 1,
                }
            },
            'zoom': {
                in: {
                    'transform': 'scale(1.2)'
                },
                out: {
                    'transform': 'scale(1)'
                }
            },
            'scale': {
                in: {
                    'transform': 'scale(0.7)'
                },
                out: {
                    'transform': 'scale(1)'
                }
            },
            'right': {
                in: {
                    'transform': 'translate(20px, 0)'
                },
                out: {
                    'transform': 'translate(0px, 0)'
                }
            }
        }
    })
    .service('$ngConfirmDefaults', function () {
        return {
            title: 'Hello',
            content: 'Are you sure to continue?',
            contentUrl: false,
            icon: '',
            theme: 'white',
            bgOpacity: 1,
            animation: 'zoom',
            closeAnimation: 'top',
            animationSpeed: 500,
            animationBounce: 1,
            scope: false,
            openDelay: 500,
            escapeKey: true,
            rtl: false,
            buttons: {},
            container: 'body',
            backgroundDismiss: false,
            alignMiddle: true,
            offsetTop: 100,
            offsetBottom: 100,
            autoClose: false,
            closeIcon: true,
            closeIconClass: false,
            watchTimerInterval: 100,
            columnClass: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1',
            onOpen: function () {
            },
        };
    })
    .service('$ngConfirmGlobal', [
        function () {
            var all = [];
            return {
                all: all,
                closeAll: function () {
                    angular.forEach(all, function (obj) {
                        if (!obj.isClosed())
                            obj.close();
                    });
                },
            }
        }
    ])
    .factory('$ngConfirm', [
        '$rootScope',
        '$ngConfirmDefaults',
        '$ngConfirmBase',
        '$ngConfirmGlobal',
        function ($rootScope, $ngConfirmDefaults, $ngConfirmBase, $ngConfirmGlobal) {
            var $ = jQuery; // using jquery.

            var ngConfirm = function (options, options2) {
                if (typeof options == 'string')
                    options = {
                        content: options,
                        title: options2 || false
                    };

                if (typeof options === 'undefined') options = {};

                /*
                 * merge options with plugin defaults.
                 */
                options = angular.extend({}, $ngConfirmDefaults, options);

                var obj = new $ngConfirmBase(options);
                $ngConfirmGlobal.all.push(obj);
                return obj;
            };

            return ngConfirm;
        }
    ])
    .factory('$ngConfirmBase', [
        '$rootScope',
        '$ngConfirmDefaults',
        '$timeout',
        '$compile',
        '$ngConfirmTemplate',
        '$interval',
        '$templateRequest',
        '$ngConfirmAnimations',
        '$log',
        function ($rootScope, $ngConfirmDefaults, $timeout, $compile, $ngConfirmTemplate, $interval, $templateRequest, $ngConfirmAnimations, $log) {
            var ngConfirmBase = function (options) {
                /*
                 Merge up the options with the object !
                 */
                angular.extend(this, options);
                this._init(); // start up.
            };

            ngConfirmBase.prototype = {
                _init: function () {
                    var that = this;
                    this._id = Math.round(Math.random() * 999999);

                    $timeout(function () {
                        that.open();
                    }, 0);
                },
                _getCSS: function (speed, bounce) {
                    return {
                        '-webkit-transition-duration': speed / 1000 + 's',
                        'transition-duration': speed / 1000 + 's',
                        '-webkit-transition-timing-function': 'cubic-bezier(.36,1.1,.2, ' + bounce + ')',
                        'transition-timing-function': 'cubic-bezier(.36,1.1,.2, ' + bounce + ')'
                    }
                },
                _watchContent: function () {
                    var that = this;
                    if (this._watchTimer) clearInterval(this._watchTimer);
                    this._watchTimer = $interval(function () {
                        var now = that._hash(that.$content.html());
                        var nowHeight = that.$content.height();
                        if (that._contentHash != now || that._contentHeight != nowHeight) {
                            that._contentHash = now;
                            that._contentHeight = nowHeight;
                            that._alignDialog();
                        }
                    }, this.watchTimerInterval);
                },
                _hash: function () {
                    return btoa((encodeURIComponent(this.$content.html())));
                },
                _unwatchContent: function () {
                    clearInterval(this._watchTimer);
                },
                _bindEvents: function () {
                    var that = this;
                    this._scope.$watch('[data.content, data.title, data.alignMiddle, data.offsetTop, data.offsetBottom]', function () {
                        that._alignDialog();
                    });
                    this._scope.$watch('data.theme', function () {
                        that._parseTheme();
                    });
                    angular.element(window).on('resize', function () {
                        that._alignDialog();
                    });

                    $timeout(function () {
                        angular.element(window).on('keyup.' + that._id, function (e) {
                            that._reactOnKey(e);
                        });
                    }, this.openDelay);
                },
                _unBindEvents: function () {

                },
                _reactOnKey: function (e) {
                    var that = this;

                    var openedModals = angular.element('.ng-confirm');
                    if (openedModals.eq(openedModals.length - 1)[0] !== this.$el[0])
                        return false;

                    var key = e.which;

                    if ($(this.$el).find(':input').is(':focus') && /13|32/.test(key)) {
                        return;
                    }

                    var keyChar = this._getKey(key);

                    if (keyChar === 'esc' && this.escapeKey) {
                        if (this.closeIcon)
                            this._closeClick();
                        else
                            this._scrollPaneClick();
                    }

                    angular.forEach(this.buttons, function (button, key) {
                        if (button.keys.indexOf(keyChar) != -1)
                            that.trigger(key);
                    })
                },
                _prepare: function () {
                    var that = this;
                    // store the last focused element.
                    this.aria = 'ng-confirm-box' + this._id;
                    this.showLoading = true;
                    this.bgLoading = true;
                    this.hilight = false;
                    this.boxClicked = false;
                    this.bgShow = false;
                    this.show = false;

                    this.bg_style = this._getCSS(this.animationSpeed, 1);
                    this.content_style = {};
                    this.contentPane_style = {};
                    this.box_style = {};

                    this._lastFocused = $('body').find(':focus');
                    this._parseTheme();

                    this._scope = $rootScope.$new(); // angular confirm scope. this scope is to be destroyed on close.
                    this.$el = $compile($ngConfirmTemplate.default)(this._scope);
                    this._scope.data = this;

                    if (!that.scope) // or provided
                        that.scope = $rootScope.$new(); // the content scope the user will use.

                    //that.scope.data = this;
                    that.$content = that.$el.find('.content');
                    if (that.contentUrl) {
                        $templateRequest(that.contentUrl).then(function (html) {
                            that.content = '<div>' + html + '</div>';
                            var compiledHtml = $compile(that.content)(that.scope);
                            that.$content.append(compiledHtml);
                            that.showLoading = false;
                        });
                    } else {
                        that.content = '<div>' + that.content + '</div>';
                        var compiledHtml = $compile(that.content)(that.scope);
                        that.$content.append(compiledHtml);
                    }

                    this._parseButtons();
                },
                _parseButtons: function () {
                    var that = this;

                    if (typeof this.buttons != 'object')
                        this.buttons = {};

                    angular.forEach(this.buttons, function (button, key) {
                        if (typeof button === 'function') {
                            that.buttons[key] = button = {
                                action: button
                            };
                        }

                        that.buttons[key].text = button.text || key;
                        that.buttons[key].class = button.class || 'btn-default';
                        that.buttons[key].action = button.action || function () {};
                        that.buttons[key].keys = button.keys || [];

                        angular.forEach(that.buttons[key].keys, function (a, i) {
                            that.buttons[key].keys[i] = a.toLowerCase();
                        });
                    });

                    if (Object.keys(this.buttons).length == 0 && this.closeIcon === null)
                        this.closeIcon = true;
                },
                _ngBoxClick: function () {
                    this.boxClicked = true;
                },
                _scrollPaneClick: function () {
                    if (this.boxClicked) {
                        this.boxClicked = false;
                        return false;
                    }

                    if (this.backgroundDismiss == 'function') {
                        var res = this.backgroundDismiss.apply(this, [this.scope]);

                        if (typeof res === 'undefined' || res) this.close(); else
                            this._hiLightModal();
                    } else {
                        if (this.backgroundDismiss)
                            this.close();
                        else
                            this._hiLightModal();
                    }
                },
                _closeClick: function () {
                    if (typeof this.closeIcon == 'function') {
                        var res = this.closeIcon.apply(this, [this.scope]);
                        if (typeof res === 'undefined' || res)
                            this.close();
                    } else {
                        this.close();
                    }
                },
                _hiLightModal: function () {
                    var that = this;
                    this.hilight = true;
                    $timeout(function () {
                        that.hilight = false;
                    }, 800);
                },
                trigger: function (buttonKey) {
                    var res = this.buttons[buttonKey].action.apply(this, [
                        this.scope,
                        this.buttons[buttonKey]
                    ]);
                    if (typeof this.onAction == 'function')
                        this.onAction(buttonKey);

                    if (typeof res === 'undefined' || res)
                        this.close();
                },
                _parseTheme: function () {
                    var that = this;
                    var themes = this.theme.split(',');
                    angular.forEach(themes, function (theme, i) {
                        if (theme.indexOf('ng-confirm-') == -1)
                            themes[i] = 'ng-confirm-' + theme.trim();
                    });
                    themes = themes.join(' ').toLowerCase();
                    this.theme = themes;
                },
                _alignDialog: function () {
                    var $content = this.$el.find('div.content');
                    var contentHeight = $content.outerHeight();
                    var contentPaneHeight = this.$el.find('.content-pane').outerHeight();
                    var offset = 100;

                    var windowHeight = angular.element(window).height();
                    var boxHeight = this.$el.find('.ng-confirm-box').outerHeight() - contentPaneHeight + contentHeight;

                    var totalOffset = (this.offsetTop) + this.offsetBottom;

                    if (boxHeight + totalOffset > windowHeight || !this.alignMiddle) {
                        this.box_style['margin-top'] = this.offsetTop;
                        this.box_style['margin-bottom'] = this.offsetBottom;
                    } else {
                        this.box_style['margin-top'] = (windowHeight - boxHeight) / 2;
                        this.box_style['margin-bottom'] = 0;
                    }

                    this.contentPane_style['height'] = contentHeight + 'px';
                },
                _getKey: function (key) {
                    // very necessary keys.
                    switch (key) {
                        case 192:
                            return 'tilde';
                        case 13:
                            return 'enter';
                        case 16:
                            return 'shift';
                        case 9:
                            return 'tab';
                        case 20:
                            return 'capslock';
                        case 17:
                            return 'ctrl';
                        case 91:
                            return 'win';
                        case 18:
                            return 'alt';
                        case 27:
                            return 'esc';
                    }

                    // only trust alphabets with this.
                    var initial = String.fromCharCode(key);
                    if (/^[A-z0-9]+$/.test(initial))
                        return initial.toLowerCase();
                    else
                        return false;
                },
                open: function () {
                    var that = this;
                    this._prepare();
                    this._bindEvents();
                    this._watchContent();
                    this.$el.focus();

                    if (!this.contentUrl)
                        that.showLoading = false;

                    if (typeof that.onOpen === 'function')
                        that.onOpen.apply(that, [that.scope]);

                    angular.element(that.container).append(that.$el);

                    if (!angular.isDefined($ngConfirmAnimations[this.animation]))
                        $log.error('Animation "' + this.animation + '" is not defined');

                    var animation = $.extend(true, $ngConfirmAnimations[that.animation], $ngConfirmAnimations.global);
                    that.box_style = angular.extend(that.box_style, animation.in);
                    that.show = true;

                    $timeout(function () {
                        that.bg_style['opacity'] = that.bgOpacity;

                        $timeout(function () {
                            that.bgLoading = false;
                            that.contentPane_style = angular.extend(that.contentPane_style, that._getCSS(that.animationSpeed, that.animationBounce));
                            that.box_style = angular.extend(that.box_style, that._getCSS(that.animationSpeed, that.animationBounce));
                            that.box_style = angular.extend(that.box_style, animation.out);
                            that._startCountDown();
                        }, that.openDelay);
                    }, 10);

                    return true;
                },
                _startCountDown: function () {
                    var that = this;
                    if (typeof this.autoClose != 'string') return;
                    var opt = this.autoClose.split('|');
                    if (opt.length != 2) $log.error('Invalid option for autoClose. example \'close|10000\'')
                    this._autoClosekey = opt[0];
                    var time = opt[1];
                    var sec = time / 1000;

                    if (!angular.isDefined(this.buttons[this._autoClosekey])) {
                        $log.error('Auto close button "' + that._autoClosekey + '" not defined.');
                        return;
                    }

                    this._autoCloseTimer = $interval(function () {
                        if (sec < 1) {
                            that.trigger(that._autoClosekey);
                            that._stopCountDown();
                        }
                        that.buttons[that._autoClosekey].timer = sec--;
                    }, 1000);
                },
                _stopCountDown: function () {
                    if (angular.isDefined(this._autoCloseTimer)) {
                        $interval.cancel(this._autoCloseTimer);
                        this._autoCloseTimer = undefined;
                        this.buttons[this._autoClosekey].timer = false;
                    }
                },
                isClosed: function () {
                    return !!this.closed;
                },
                close: function () {
                    var that = this;
                    if (typeof this.onClose === 'function')
                        this.onClose();

                    this._unwatchContent();
                    this._unBindEvents();
                    angular.element('body').removeClass('ng-confirm-noscroll-' + this._id);

                    this.$el.addClass(this.closeAnimation);
                    var closeTimer = this.animationSpeed;
                    this.bg_style['opacity'] = 0;

                    if (that.closeAnimation && !angular.isDefined($ngConfirmAnimations[that.closeAnimation])) {
                        $log.info('Close animation "' + that.closeAnimation + '" is not defined, using "' + that.animation + '" instead');
                        that.closeAnimation = that.animation;
                    }
                    var closeAnimation = $.extend(true, $ngConfirmAnimations[that.closeAnimation], $ngConfirmAnimations.global);
                    that.box_style = angular.extend(that.box_style, closeAnimation.in);

                    setTimeout(function () {
                        that._lastFocused.focus();
                        that.closed = true;
                        that.$el.remove();
                        that._scope.$destroy();
                    }, closeTimer * 0.70); // 40% of the time.

                    return true;
                }
            };

            return ngConfirmBase;
        }
    ]);