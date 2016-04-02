/*!
 * angular-confirm v1.0.0 (http://craftpip.github.io/angular-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2015 angular-confirm
 * Licensed under MIT (https://github.com/craftpip/angular-confirm/blob/master/LICENSE)
 */

"use strict";

if (typeof jQuery === 'undefined')
    throw new Error('angular-confirm requires jQuery');
if (typeof angular === 'undefined')
    throw new Error('angular-confirm requires Angular');

try { angular.module('ngSanitize')} catch (e) {
    throw new Error('angular-confirm requires ngSanitize: https://docs.angularjs.org/api/ngSanitize');
}
try { angular.module('ngAnimate')} catch (e) {
    throw new Error('angular-confirm requires ngAnimate: https://docs.angularjs.org/api/ngAnimate');
}

angular.module('ngConfirm', [
        'ngSanitize',
        'ngAnimate'
    ])
    .service('$ngConfirmTemplate', function () {
        var template = '<div class="ng-confirm" ng-class="[parent.theme, parent.rtl_class]" aria-labelledby="{{aria}}" tabindex="-1">' +
            '<div class="ng-confirm-bg" ng-show="parent.show" ng-style="parent.bg_style"></div>' +
            '<div class="ng-confirm-scrollpane" ng-click="parent._scrollPaneClick()">' +
            '<div class="container">' +
            '<div class="row">' +
            '<div class="ng-confirm-box-container" ng-class="parent.columnClass">' +
            '<div class="ng-confirm-box {{parent.current_animation}}" ng-show="parent.show" ng-click="parent._ngBoxClick()" ng-style="parent.box_style" ng-class="{loading: parent.showLoading, hilight: parent.hilight }" role="dialog" aria-labelledby="labelled" tabindex="-1">' +
            '<div class="closeIcon" ng-click="parent._closeClick()"><span ng-if="!parent.closeIconClass">&times;</span><i class="parent.closeIconClass" ng-if="parent.closeIconClass"></i></div>' +
            '<div class="title-c">' +
            '<span class="icon-c"><i ng-if="parent.icon" ng-class="parent.icon"></i></span>' +
            '<span class="title">{{parent.title}}</span>' +
            '</div>' +
            '<div class="content-pane" ng-style="parent.contentPane_style">' +
            '<div class="content" ng-style="parent.content_style"></div>' +
            '</div>' +
            '<div class="buttons">' +
            '<button type="button" ng-repeat="(key, button) in parent.buttons" ng-click="parent.trigger(key)" class="btn" ng-class="button.class">{{button.text}}</button>' +
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
    .service('$ngConfirmDefaults', function () {
        return {
            title: 'Hello',
            content: 'Are you sure to continue?',
            contentUrl: false,
            icon: '',
            theme: 'white',
            bgOpacity: 0.5,
            animation: 'zoom', // not used
            closeAnimation: 'scale', // not used
            animationSpeed: 500, // not used
            animationBounce: 1.2, // not used
            scope: false,
            escapeKey: false,
            rtl: false,
            container: 'body',
            confirm: function () {
            },
            cancel: function () {
            },
            backgroundDismiss: false,
            autoClose: false,
            closeIcon: null,
            closeIconClass: false,
            watchTimerInterval: 100,
            columnClass: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1',
            onOpen: function () {
            },
            onClose: function () {
            },
            onAction: function () {
            }
        };
    })
    .factory('$ngConfirm', [
        '$rootScope',
        '$ngConfirmDefaults',
        '$ngConfirmBase',
        function ($rootScope, $ngConfirmDefaults, $ngConfirmBase) {
            var $ = jQuery; // using jquery.

            var ngConfirm = function (options) {
                if (typeof options === 'undefined') options = {};

                /*
                 * merge options with plugin defaults.
                 */
                var options = angular.extend({}, $ngConfirmDefaults, options);

                return new $ngConfirmBase(options);
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
        function ($rootScope, $ngConfirmDefaults, $timeout, $compile, $ngConfirmTemplate, $interval, $templateRequest) {
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
                    this.aria = 'ng-confirm-box' + this._id;
                    this.showLoading = true;
                    this.hilight = false;
                    this.boxClicked = false;
                    this.show = false;
                    this.content_style = {};
                    this.contentPane_style = {};
                    this.box_style = {};
                    this.bg_style = this._getCSS(this.animationSpeed, 1);

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
                    $(window).on('resize.' + this._id, function () {
                        that.scope.$apply(function () {
                            that._alignDialog();
                        })
                    });
                    this.scope.$watch('parent.content', function () {
                        that._alignDialog();
                    });
                },
                _unBindEvents: function () {
                    $(window).unbind('resize.' + this._id);
                    $(window).unbind('keyup.' + this._id);
                },
                _prepare: function () {
                    var that = this;
                    // store the last focused element.
                    this._lastFocused = $('body').find(':focus');
                    this._parseTheme();
                    this.bg_style['opacity'] = this.bgOpacity;

                    if (!this.scope)
                        this.scope = $rootScope.$new(true);

                    this.$el = $compile($ngConfirmTemplate.default)(this.scope);
                    this.scope.parent = this;
                    angular.element(this.container).append(this.$el);

                    this.$content = this.$el.find('.content');

                    if (this.contentUrl) {
                        $templateRequest(this.contentUrl).then(function (html) {
                            that.content = html;
                            that.content = '<div>' + that.content + '</div>';
                            var compiledHtml = $compile(that.content)(that.scope);
                            that.$content.append(compiledHtml);
                            that.showLoading = false;
                        });
                    } else {
                        this.content = '<div>' + this.content + '</div>';
                        var compiledHtml = $compile(this.content)(this.scope);
                        this.$content.append(compiledHtml);
                    }

                    if (this.rtl)
                        this.rtl_class = 'rtl';

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
                    console.log(this.scope);
                    var res = this.buttons[buttonKey].action.apply(this, [
                        this.scope,
                        this.buttons[buttonKey]
                    ]);
                    if (typeof this.onAction == 'function')
                        this.onAction(buttonKey);

                    if (typeof res === 'undefined' || res)
                        this.close();
                },
                setTheme: function (theme) {
                    this.theme = theme;
                    this._parseTheme();
                },
                _parseTheme: function () {
                    var that = this;
                    var themes = this.theme.split(',');
                    angular.forEach(themes, function (theme, i) {
                        themes[i] = 'ng-confirm-' + theme.trim();
                    });
                    themes = themes.join(' ').toLowerCase();
                    this.theme = themes;
                },
                _alignDialog: function () {
                    var $contentPane = this.$el.find('.content-pane');
                    var windowHeight = angular.element(window).height();
                    var $content = this.$el.find('div.content');
                    var contentHeight = 0;
                    var paneHeight = 0;
                    if (this.content) {
                        contentHeight = $content.outerHeight() || 0;
                        paneHeight = $contentPane.height() || 0;
                        if (paneHeight == 0)
                            paneHeight = contentHeight; //yes
                    }

                    var off = 100;
                    var w = $content.outerWidth();

                    this.content_style = {
                        'clip': 'rect(0px ' + (off + w) + 'px ' + contentHeight + 'px -' + off + 'px)'
                    };

                    this.contentPane_style = {
                        'height': contentHeight + 'px',
                    };

                    var boxHeight = this.$el.find('.ng-confirm-box').outerHeight() - paneHeight + contentHeight;
                    var topMargin = (windowHeight - boxHeight) / 2;
                    var minMargin = 100;

                    var $body = angular.element('body');
                    var style = {};
                    //console.log(boxHeight, windowHeight, minMargin);
                    if (boxHeight > (windowHeight - minMargin)) {
                        this.box_style['margin-top'] = minMargin / 2;
                        this.box_style['margin-bottom'] = minMargin / 2;
                        $body.addClass('ng-confirm-noscroll-' + this._id);
                    } else {
                        this.box_style['margin-top'] = topMargin;
                        this.box_style['margin-bottom'] = 0;
                        $body.removeClass('ng-confirm-noscroll-' + this._id);
                    }
                },
                open: function () {
                    var that = this;
                    this._prepare();
                    this._bindEvents();
                    this._watchContent();

                    this.$el.focus();
                    that.show = true;
                    that._alignDialog();
                    if (!this.contentUrl)
                        that.showLoading = false;

                    this.content_style = this._getCSS(this.animationSpeed, 1);
                    this.contentPane_style = this._getCSS(this.animationSpeed, 1);
                    this.box_style = this._getCSS(this.animationSpeed, 1);

                    $timeout(function () {
                        if (typeof that.onOpen === 'function')
                            that.onOpen();
                    }, this.animationSpeed);

                    return true;
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
                    that.show = false;

                    setTimeout(function () {
                        that._lastFocused.focus();
                        that.closed = true;
                        that.$el.remove();
                    }, closeTimer * 0.40); // 40% of the time.

                    return true;
                }
            };

            return ngConfirmBase;
        }
    ]);