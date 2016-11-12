/*!
 * angular-confirm v1.0.0 (http://craftpip.github.io/angular-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2016-2016 angular-confirm
 * Licensed under MIT (https://github.com/craftpip/angular-confirm/blob/master/LICENSE)
 */

"use strict";

if (typeof jQuery === 'undefined')
    throw new Error('angular-confirm requires jQuery');
if (typeof angular === 'undefined')
    throw new Error('angular-confirm requires Angular');

try {
    angular.module('ngSanitize')
} catch (e) {
    throw new Error('angular-confirm requires ngSanitize: https://docs.angularjs.org/api/ngSanitize');
}

try {
    angular.module('ngAnimate')
} catch (e) {
    throw new Error('angular-confirm requires ngAnimate: https://docs.angularjs.org/api/ngSanitize');
}

angular.module('ngConfirm', [
    'ngSanitize',
])
    .service('$ngConfirmTemplate', function () {
        var template = '<div class="ng-confirm">' +
            '<div class="ng-confirm-bg ng-confirm-bg-h" data-ng-style="ngc.styleBg"></div>' +
            '<div class="ng-confirm-scrollpane" data-ng-click="ngc._scrollPaneClick()">' +
            '<div class="ng-bs3-container">' +
            '<div class="ng-bs3-row">' +
            '<div class="ng-confirm-box-container">' +
            '<div class="ng-confirm-box" data-ng-click="ngc._ngBoxClick()" data-ng-class="[{hiLight: ngc.hiLight}]" role="dialog" aria-labelledby="labelled" tabindex="-1">' +
            '<div class="ng-confirm-closeIcon" data-ng-show="ngc.closeIcon" data-ng-click="ngc._closeClick()"><span data-ng-if="!ngc.closeIconClass">&times;</span><i data-ng-class="ngc.closeIconClass" data-ng-if="ngc.closeIconClass"></i></div>' +
            '<div class="ng-confirm-title-c">' +
            '<span class="ng-confirm-icon-c"><i data-ng-if="ngc.icon" data-ng-class="ngc.icon"></i></span>' +
            '<span class="ng-confirm-title" data-ng-show="ngc.title">{{ngc.title}}</span>' +
            '</div>' +
            '<div class="ng-confirm-content-pane" data-ng-style="ngc.styleContentPane">' +
            '<div class="ng-confirm-content" data-ng-style="ngc.styleContent"></div>' +
            '</div>' +
            '<div class="ng-confirm-buttons">' +
            '<button type="button" data-ng-repeat="(key, button) in ngc.buttons" data-ng-click="ngc._buttonClick(key)" class="btn" data-ng-class="button.class">{{button.text}}<span data-ng-show="button.timer"> ({{button.timer}})</span></button>' +
            '</div>' +
            '<div class="ng-confirm-clear">' +
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
            'zoom': {
                in: {
                    'transform': 'scale(1.2)',
                    'opacity': 0,
                },
                out: {
                    'transform': 'scale(1)',
                    'opacity': 1,
                }
            },
            'scale': {
                in: {
                    'transform': 'scale(0.7)',
                    'opacity': 0,
                },
                out: {
                    'transform': 'scale(1)',
                    'opacity': 1,
                }
            },
            'right': {
                in: {
                    'transform': 'translate(20px, 0)',
                    'opacity': 0,
                },
                out: {
                    'transform': 'translate(0px, 0)',
                    'opacity': 1,
                }
            }
        }
    })
    .service('$ngConfirmDefaults', function () {
        return {
            title: 'Hello',
            titleClass: '', // todo: implementation
            type: 'default', // todo: implement this
            typeAnimated: true, // todo: implement this
            content: 'Are you sure to continue?',
            contentUrl: false,
            icon: '',
            theme: 'white',
            bgOpacity: null, // todo: implement this
            animation: 'zoom',
            closeAnimation: 'zoom',
            animationSpeed: 400,
            animationBounce: 1.2,
            scope: false,
            escapeKey: true,
            rtl: false,
            buttons: {},
            container: 'body',
            containerFluid: false, // todo: implement this.
            backgroundDismiss: false,
            backgroundDismissAnimation: 'shake', // todo: implement this.
            alignMiddle: true, // what is this ?
            offsetTop: 100,
            offsetBottom: 100,
            autoClose: false,
            closeIcon: true,
            closeIconClass: false,
            watchInterval: 100,
            columnClass: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1',
            boxWidth: '50%', // todo: implement this.
            useBootstrap: true, // todo: implement this.
            bootstrapClasses: { // todo: implement this.
                container: 'container',
                containerFluid: 'container-fluid',
                row: 'row',
            },
            onContentReady: function () {

            },
            onOpenBefore: function () {

            },
            onOpen: function () {

            },
            onClose: function () {

            },
            onDestroy: function () {

            },
            onAction: function () {

            }

        };
    })
    .service('$ngConfirmGlobal', [
        function () {
            var instances = [];
            return {
                instances: instances,
                closeAll: function () {
                    angular.forEach(instances, function (obj) {
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
                $ngConfirmGlobal.instances.push(obj);
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
        '$q',
        function ($rootScope, $ngConfirmDefaults, $timeout, $compile, $ngConfirmTemplate, $interval, $templateRequest, $ngConfirmAnimations, $log, $q) {
            var ngConfirmBase = function (options) {
                /*
                 Merge up the options with the object !
                 */
                angular.extend(this, options);
                this._init();
            };

            ngConfirmBase.prototype = {
                _init: function () {
                    var that = this;

                    this._lastFocused = angular.element('body').find(':focus');
                    this._id = Math.round(Math.random() * 999999);
                    $timeout(function () {
                        that.open();
                    }, 0);
                },
                _prepare: function () {
                    var that = this;

                    // This is angular-confirm's scope. this is destroyed on close.
                    this._scope = $rootScope.$new();
                    this.$el = $compile($ngConfirmTemplate.default)(this._scope);
                    this._scope.ngc = this;

                    // This is the scope that the user provided, the content is to be bind to this scope.
                    if (!that.scope)
                        that.scope = $rootScope.$new();

                    this._parseAnimation(this.animation, 'o');
                    this._parseAnimation(this.closeAnimation, 'c');
                    this._parseBgDismissAnimation(this.backgroundDismissAnimation);
                    this._parseTheme(this.theme);
                    this._parseButtons();
                    this._parseType(this.type);

                    this.$confirmBox = this.$el.find('.ng-confirm-box');
                    this.$titleContainer = this.$el.find('.ng-confirm-title-c');
                    this.$content = this.$el.find('.ng-confirm-content');
                    this.$confirmBg = this.$el.find('.ng-confirm-bg');
                    this.$contentPane = this.$el.find('.ng-confirm-content-pane');
                    this.$confirmContainer = this.$el.find('.ng-confirm-box-container');

                    this.$confirmBox.addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed);
                    if (this.typeAnimated)
                        this.$confirmBox.addClass('ng-confirm-type-animated');

                    if (this.useBootstrap) {
                        this.$el.find('.ng-bs3-row').addClass(this.bootstrapClasses.row);
                        this.$el.find('.ng-bs3-container').addClass(this.columnClassParsed);
                        if (this.containerFluid)
                            this.$el.find('.ng-bs3-container').addClass(this.bootstrapClasses.containerFluid);
                        else
                            this.$el.find('.ng-bs3-container').addClass(this.bootstrapClasses.container);

                        this.$confirmContainer.addClass(this.columnClass);
                    } else {
                        this.$confirmBox.css('width', this.boxWidth);
                    }

                    if (this.titleClass)
                        this.$titleContainer.addClass(this.titleClass);

                    this.$el.addClass(this.themeParsed);

                    var ariaLabel = 'ng-confirm-box' + this._id;
                    this.$confirmBox.attr('aria-labelledby', ariaLabel);
                    this.$content.attr('id', ariaLabel);

                    if (this.bgOpacity != null)
                        this.$confirmBg.css('opacity', this.bgOpacity);

                    if (this.rtl)
                        this.$el.addClass('ng-confirm-rtl');

                    this._contentReady = $q.defer();
                    this._modalReady = $q.defer();

                    $q.all([this._contentReady.promise, this._modalReady.promise]).then(function () {
                        if (that.isAjax){
                            that.setContent(that.content);
                            that.loading(false);
                        }
                    });

                    if (that.contentUrl) {
                        that.loading(true);
                        that.isAjax = true;
                        var contentUrl = that.contentUrl;
                        if (typeof that.contentUrl == 'function')
                            contentUrl = that.contentUrl();

                        that.loading(true);
                        that.isAjaxLoading = true;
                        $templateRequest(contentUrl).then(function (html) {
                            that.content = html;
                            that._contentReady.resolve();
                            that.isAjaxLoading = false;
                        }, function () {
                            that.content = '';
                            that._contentReady.resolve();
                            that.isAjaxLoading = false;
                        });
                    } else {
                        var content = that.content;
                        if (typeof that.content == 'function')
                            content = that.content();

                        that.content = content;
                        that.setContent(that.content);
                        that._contentReady.resolve();
                    }


                    that._contentHash = this._hash(that.$content.html());
                    that._contentHeight = this.$content.height();

                    this._watchContent();

                    if (this.animation == 'none') {
                        this.animationSpeed = 1;
                        this.animationBounce = 1;
                    }

                    this.$confirmBg.css(this._getCSS(this.animationSpeed, 1));
                },
                isAjax: false,
                isAjaxLoading: false,
                isLoading: false,
                loading: function (show) {
                    this.isLoading = show;
                    if (show)
                        this.$confirmBox.addClass('ng-confirm-loading');
                    else
                        this.$confirmBox.removeClass('ng-confirm-loading');
                },
                setContent: function (contentHtml) {
                    if (!this.$content) {
                        console.error('Attempted to set content before $content is defined');
                        return;
                    }
                    contentHtml = "<div>" + contentHtml + "</div>";
                    var compiledHtml = $compile(contentHtml)(this.scope);
                    this.$content.append(compiledHtml);
                },
                _typeList: ['default', 'blue', 'green', 'red', 'orange', 'purple', 'dark'],
                _typePrefix: 'ng-confirm-',
                typeParsed: '',
                _parseType: function (type) {
                    if (this._typeList.indexOf(type.toLowerCase()) == -1) {
                        console.warn('Invalid dialog type: ' + type);
                    } else {
                        this.typeParsed = this._typePrefix + type;
                    }
                },
                animationParsed: '',
                closeAnimationParsed: '',
                _animationPrefix: 'ng-confirm-animation-',
                _parseAnimation: function (animation, which) { // ready
                    which = which || 'o';
                    var animations = animation.split(',');
                    var that = this;
                    angular.forEach(animations, function (a, k) {
                        if (a.indexOf(that._animationPrefix) == -1)
                            animations[k] = that._animationPrefix + a.trim();
                    })
                    var a_string = animations.join(' ').toLowerCase();
                    if (which == 'o')
                        this.animationParsed = a_string;
                    else
                        this.closeAnimationParsed = a_string;

                    return a_string;
                },
                backgroundDismissAnimationParsed: '',
                _bgDismissPrefix: 'ng-confirm-hilight-',
                _parseBgDismissAnimation: function (bgDismissAnimation) { // ready
                    var animation = bgDismissAnimation.split(',');
                    var that = this;
                    angular.forEach(animation, function (a, k) {
                        if (a.indexOf(that._bgDismissPrefix) == -1)
                            animation[k] = that._bgDismissPrefix + a.trim();
                    });
                    this.backgroundDismissAnimationParsed = animation.join(' ').toLowerCase();
                },
                _parseButtons: function () { // ready
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
                        that.buttons[key].btnClass = button.btnClass || 'btn-default';
                        that.buttons[key].action = button.action || angular.noop;
                        that.buttons[key].keys = button.keys || [];
                        that.buttons[key].disabled = button.disabled || false;
                        that.buttons[key].show = button.show || false;

                        angular.forEach(that.buttons[key].keys, function (a, i) {
                            that.buttons[key].keys[i] = a.toLowerCase();
                        });
                    });

                    if (Object.keys(this.buttons).length == 0 && this.closeIcon === null)
                        this.closeIcon = true;
                },
                _themePrefix: 'ng-confirm-',
                themeParsed: '',
                _parseTheme: function (theme) { // done
                    var that = this;
                    var themes = theme.split(',');
                    angular.forEach(themes, function (theme, i) {
                        if (theme.indexOf(that._themePrefix) == -1)
                            themes[i] = that._themePrefix + theme.trim();
                    });
                    this.themeParsed = themes.join(' ').toLowerCase();
                },
                _cubic_bezier: '0.36, 0.55, 0.19',
                _getCSS: function (speed, bounce) {
                    return {
                        '-webkit-transition-duration': speed / 1000 + 's',
                        'transition-duration': speed / 1000 + 's',
                        '-webkit-transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')',
                        'transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')'
                    }
                },
                _hash: function (hash) {
                    return btoa((encodeURIComponent(hash)));
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
                            that.setDialogCenter('watchContent');
                        }
                    }, this.watchInterval);
                },
                _unwatchContent: function () {
                    clearInterval(this._watchTimer);
                },
                _bindEvents: function () {
                    var that = this;
                    this._scope.$watch('[ngc.content, ngc.title, ngc.alignMiddle, ngc.offsetTop, ngc.offsetBottom]', function () {
                        that.setDialogCenter('bindEvents');
                    });
                    this._scope.$watch('ngc.theme', function () {
                        that._parseTheme(that.theme);
                    });
                    angular.element(window).on('resize.' + that._id, function () {
                        that.setDialogCenter('Window Resize');
                    });
                    angular.element(window).on('keyup.' + that._id, function (e) {
                        that._reactOnKey(e);
                    });
                },
                _unBindEvents: function () {
                    angular.element(window).off('resize.' + this._id);
                    angular.element(window).off('keyup.' + this._id);
                },
                _mergeStyles: function (array) {
                    var obj = {};
                    angular.forEach(array, function (a, i) {
                        angular.extend(obj, a);
                    });
                    return obj;
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
                _hilightAnimating: false,
                _hiLightModal: function () {
                    var that = this;
                    if (this.hiLight)
                        return;

                    this.hiLight = true;
                    $timeout(function () {
                        that.hiLight = false;
                    }, 800);
                },
                _buttonClick: function (buttonKey) {
                    var res = this.buttons[buttonKey].action.apply(this, [this.scope, this.buttons[buttonKey]]);
                    if (typeof this.onAction === 'function')
                        this.onAction.apply(this, [buttonKey]);

                    if (typeof res === 'undefined' || res)
                        this.close();
                },
                setDialogCenter: function (where) {
                    var $content = this.$content;
                    var contentHeight = $content.outerHeight();
                    var contentPaneHeight = this.$contentPane.outerHeight();

                    var children = $content.children();
                    if (children.length != 0) {
                        // angular jq css will only return inline css.
                        var marginTopChild = parseInt(children.eq(0).css('margin-top'));
                        if (marginTopChild)
                            contentHeight += marginTopChild;
                    }

                    var windowHeight = angular.element(window).height();

                    var confirmBoxHeight = this.$confirmBox.outerHeight();
                    if(confirmBoxHeight == 0){
                        console.log(where, confirmBoxHeight);
                        return;
                    }
                    // console.log(confirmBoxHeight, contentPaneHeight, contentHeight);
                    var boxHeight = (confirmBoxHeight - contentPaneHeight) + contentHeight;
                    var totalOffset = (this.offsetTop) + this.offsetBottom;
                    var style;

                    console.log(where, confirmBoxHeight, contentPaneHeight, contentHeight, boxHeight, contentHeight, contentPaneHeight);
                    if (boxHeight > (windowHeight - totalOffset) || !this.alignMiddle) {
                        style = {
                            'margin-top': this.offsetTop,
                            'margin-bottom': this.offsetBottom,
                        };
                        angular.element('body').addClass('ng-confirm-no-scroll-' + this._id);
                    } else {
                        style = {
                            'margin-top': (windowHeight - boxHeight) / 2,
                            'margin-bottom': 0,
                        };
                        angular.element('body').removeClass('ng-confirm-no-scroll-' + this._id);
                    }

                    this.$contentPane.css({
                        'height': contentHeight,
                    });
                    this.$confirmBox.css(style);
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
                    $timeout(function(){
                        that._open();
                    }, 100);

                    return true;
                },
                _open: function () {
                    var that = this;

                    if (typeof that.onOpenBefore == 'function')
                        that.onOpenBefore.apply(that, [that.scope]);

                    console.log(that.$el.html());
                    angular.element(that.container).append(that.$el);
                    that.setDialogCenter('_open');

                    $timeout(function () {
                        console.log(that.$el.html());
                        that.$contentPane.css(that._getCSS(that.animationSpeed, 1));
                        that.$confirmBox.css(that._getCSS(that.animationSpeed, that.animationBounce));
                        that.$confirmBox.removeClass(that.animationParsed);
                        that.$confirmBg.removeClass('ng-confirm-bg-h');

                        $timeout(function () {
                            that._bindEvents();
                            that.$confirmBox.css(that._getCSS(that.animationSpeed, 1));
                            that._modalReady.resolve();
                            if (typeof that.onOpen === 'function')
                                that.onOpen.apply(that, [that.scope]);

                        }, that.animationSpeed);
                    }, 0);
                },
                _startCountDown: function () {
                    var that = this;
                    if (typeof this.autoClose != 'string') return;
                    var opt = this.autoClose.split('|');
                    // if (opt.length != 2) $log.error('Invalid option for autoClose. example \'close|10000\'')
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
                closed: false,
                isClosed: function () {
                    return this.closed;
                },
                isOpen: function(){
                    return !this.closed;
                },
                close: function () {
                    var that = this;
                    if (typeof this.onClose === 'function')
                        this.onClose();

                    this._unwatchContent();
                    this._unBindEvents();

                    this.$confirmBox.addClass(this.closeAnimationParsed);
                    this.$confirmBg.addClass('ng-confirm-bg-h');
                    var closeTimer = this.animationSpeed * .4;

                    $timeout(function () {
                        angular.element('body').removeClass('ng-confirm-noscroll-' + that._id);
                        that._lastFocused.focus();
                        that.closed = true;
                        that.$el.remove();
                        that._scope.$destroy();

                        if(typeof that.onDestroy == 'function')
                            that.onDestroy.apply(that, [that.scope]);

                    }, closeTimer);

                    return true;
                }
            };

            return ngConfirmBase;
        }
    ]);