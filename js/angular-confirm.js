/*!
 * angular-confirm v1.1.0 (http://craftpip.github.io/angular-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2016-2017 angular-confirm
 * Licensed under MIT (https://github.com/craftpip/angular-confirm/blob/master/LICENSE)
 */

"use strict";

if (typeof jQuery === 'undefined')
    throw new Error('angular-confirm requires jQuery');
if (typeof angular === 'undefined')
    throw new Error('angular-confirm requires Angular');

angular.module('cp.ngConfirm', [])
    .service('$ngConfirmTemplate', function () {
        this.default = '<div class="ng-confirm">' +
            '<div class="ng-confirm-bg ng-confirm-bg-h"></div>' +
            '<div class="ng-confirm-scrollpane">' +
            '<div class="ng-bs3-container">' +
            '<div class="ng-bs3-row">' +
            '<div class="ng-confirm-box-p">' +
            '<div class="ng-confirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1">' +
            '<div class="ng-confirm-closeIcon"></div>' +
            '<div class="ng-confirm-title-c">' +
            '<span class="ng-confirm-icon-c"><i></i></span>' +
            '<span class="ng-confirm-title"></span>' +
            '</div>' +
            '<div class="ng-confirm-content-pane">' +
            '<div class="ng-confirm-content"></div>' +
            '</div>' +
            '<div class="ng-confirm-buttons">' +
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
    })
    .service('$ngConfirmDefaults', function () {
        return {
            title: 'Hello',
            titleClass: '',
            type: 'default',
            typeAnimated: true,
            content: 'Are you sure to continue?',
            contentUrl: false,
            defaultButtons: {
                ok: function () {

                },
            },
            icon: '',
            theme: 'white',
            bgOpacity: null,
            animation: 'zoom',
            closeAnimation: 'scale',
            animationSpeed: 400,
            animationBounce: 1.2,
            scope: false,
            escapeKey: false,
            rtl: false,
            buttons: {},
            container: 'body',
            containerFluid: false,
            backgroundDismiss: false,
            backgroundDismissAnimation: 'shake',
            alignMiddle: true,
            offsetTop: 50,
            offsetBottom: 50,
            autoClose: false,
            closeIcon: null,
            closeIconClass: false,
            columnClass: 'small',
            boxWidth: '50%',
            useBootstrap: true,
            bootstrapClasses: {
                container: 'container',
                containerFluid: 'container-fluid',
                row: 'row',
            },
            onScopeReady: function () {

            },
            onReady: function () {

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
    .service('$ngConfirm', [
        '$rootScope',
        '$ngConfirmDefaults',
        '$ngConfirmBase',
        function ($rootScope, $ngConfirmDefaults, $ngConfirmBase) {
            return function (options, options2, option3) {
                if (typeof options == 'string') {
                    options = {
                        content: options,
                        buttons: $ngConfirmDefaults.defaultButtons
                    };
                    if (typeof options2 == 'string')
                        options['title'] = options2 || false;
                    else
                        options['title'] = false;
                    if (typeof options2 == 'object')
                        options['scope'] = options2;
                    if (typeof option3 == 'object')
                        options['scope'] = option3;
                }

                if (typeof options === 'undefined') options = {};

                /*
                 * merge options with plugin defaults.
                 */
                options = angular.extend({}, $ngConfirmDefaults, options);

                return new $ngConfirmBase(options);
            };
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
        '$log',
        '$q',
        function ($rootScope, $ngConfirmDefaults, $timeout, $compile, $ngConfirmTemplate, $interval, $templateRequest, $log, $q) {
            var ngConfirmBase = function (options) {
                angular.extend(this, options);
                this._init();
            };

            ngConfirmBase.prototype = {
                _init: function () {
                    this._lastFocused = angular.element('body').find(':focus');
                    this._id = Math.round(Math.random() * 999999);
                    this.open();
                },
                _providedScope: false, // has the user provided a scope.
                _prepare: function () {
                    var that = this;

                    this.$el = angular.element($ngConfirmTemplate['default']);

                    // Has the user provided us with the scope.
                    if (that.scope) {
                        this._providedScope = true;
                    } else {
                        this._providedScope = false;
                        that.scope = $rootScope.$new();
                    }

                    // scope is ready.
                    if (typeof this.onScopeReady == 'function')
                        this.onScopeReady.apply(this, [this.scope]);

                    // Dom elements
                    this.$confirmBox = this.$el.find('.ng-confirm-box');
                    this.$confirmBoxParent = this.$el.find('.ng-confirm-box-p');
                    this.$titleContainer = this.$el.find('.ng-confirm-title-c');
                    this.$title = this.$el.find('.ng-confirm-title');
                    this.$icon = this.$el.find('.ng-confirm-icon-c');
                    this.$content = this.$el.find('.ng-confirm-content');
                    this.$confirmBg = this.$el.find('.ng-confirm-bg');
                    this.$contentPane = this.$el.find('.ng-confirm-content-pane');
                    this.$closeIcon = this.$el.find('.ng-confirm-closeIcon');
                    this.$bs3Container = this.$el.find('.ng-bs3-container');
                    this.$buttonContainer = this.$el.find('.ng-confirm-buttons');
                    this.$scrollPane = this.$el.find('.ng-confirm-scrollpane');

                    var ariaLabel = 'ng-confirm-box' + this._id;
                    this.$confirmBox.attr('aria-labelledby', ariaLabel);
                    this.$content.attr('id', ariaLabel);

                    this._setAnimationClass(this.animation);
                    this.setDismissAnimation(this.backgroundDismissAnimation);
                    this.setTheme(this.theme);
                    this.setType(this.type);
                    this._setButtons(this.buttons);
                    this.setCloseIcon(this.closeIcon);
                    this.setCloseIconClass(this.closeIconClass);

                    this.setTypeAnimated(this.typeAnimated);
                    if (this.useBootstrap) {
                        this.setColumnClass(this.columnClass);
                        this.$el.find('.ng-bs3-row').addClass(this.bootstrapClasses.row)
                            .addClass('justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center');

                        this.setContainerFluid(this.containerFluid);
                    } else {
                        this.setBoxWidth(this.boxWidth);
                    }
                    this.setTitleClass(this.titleClass);
                    this.setTitle(this.title);
                    this.setIcon(this.icon);
                    this.setBgOpacity(this.bgOpacity);
                    this.setRtl(this.rtl);

                    this._contentReady = $q.defer();
                    this._modalReady = $q.defer();

                    $q.all([this._contentReady.promise, this._modalReady.promise]).then(function () {
                        if (that.isAjax) {
                            that.setContent(that.content);
                            that.loading(false);
                        }
                        if (typeof that.onReady == 'function') {
                            that.onReady.apply(that, [that.scope]);
                        }
                    });

                    if (this.contentUrl) {
                        this.loading(true);
                        this.isAjax = true;
                        var contentUrl = this.contentUrl;
                        if (typeof this.contentUrl == 'function')
                            contentUrl = this.contentUrl();

                        this.isAjaxLoading = true;
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
                        var content = this.content;
                        if (typeof this.content == 'function')
                            content = this.content();

                        this.content = content;
                        this.setContent(this.content);
                        this._contentReady.resolve();
                    }

                    // this._watchContent();

                    if (this.animation == 'none') {
                        this.animationSpeed = 1;
                        this.animationBounce = 1;
                    }

                    this.$confirmBg.css(this._getCSS(this.animationSpeed, 1));
                },
                isAjax: false,
                isAjaxLoading: false,
                isLoading: false,
                _hideClass: 'ng-confirm-el-hide',
                _loadingClass: 'ng-confirm-loading',
                /**
                 * Shows the loading spinner
                 * @param show
                 */
                loading: function (show) {
                    this.isLoading = show;
                    if (show)
                        this.$confirmBox.addClass(this._loadingClass);
                    else
                        this.$confirmBox.removeClass(this._loadingClass);
                },
                /**
                 * Set content to DOM.
                 * @param contentHtml
                 * @private
                 */
                setContent: function (contentHtml) {
                    if (!this.$content) {
                        $log.error('Attempted to set content before $content is defined');
                        return;
                    }
                    contentHtml = "<div>" + contentHtml + "</div>";
                    var compiledHtml = $compile(contentHtml)(this.scope);
                    this.$content.append(compiledHtml);
                },
                _typeList: ['default', 'blue', 'green', 'red', 'orange', 'purple', 'dark'],
                _typePrefix: 'ng-confirm-type-',
                _pSetType: '',
                /**
                 * Set the type class
                 * @param type
                 * @returns {boolean}
                 */
                setType: function (type) {
                    if (this._typeList.indexOf(type.toLowerCase()) == -1) {
                        $log.warn('Invalid dialog type: ' + type);
                        return false;
                    } else {
                        var c = this._typePrefix + type;
                        this.$el.removeClass(this._pSetType).addClass(c);
                        this._pSetType = c;
                    }
                },
                _setTypeAnimatedClass: 'ng-confirm-type-animated',
                /**
                 * Adds or removes the type animated class
                 * @param state
                 */
                setTypeAnimated: function (state) {
                    if (state)
                        this.$confirmBox.addClass(this._setTypeAnimatedClass);
                    else
                        this.$confirmBox.removeClass(this._setTypeAnimatedClass);
                },
                _pTitleClass: '',
                /**
                 * Sets the title class or classes
                 * @param str
                 */
                setTitleClass: function (str) {
                    this.$titleContainer.removeClass(this._pTitleClass).addClass(str);
                    this._pTitleClass = str;
                },
                /**
                 * Sets box width,
                 * requires useBootstrap to be false.
                 * @param units
                 */
                setBoxWidth: function (units) {
                    if (this.useBootstrap) {
                        $log.warn('Cannot set boxWidth as useBootstrap is set to true. use columnClass instead.');
                        return;
                    }

                    this.$confirmBox.css('width', units);
                },
                /**
                 * Set the container class as fluid or not.
                 * requires useBootstrap to be true
                 * @param state
                 */
                setContainerFluid: function (state) {
                    if (!this.useBootstrap) {
                        $log.warn('Cannot set containerFluid as useBootstrap is set to false.');
                        return;
                    }

                    if (state) {
                        this.$bs3Container.removeClass(this.bootstrapClasses.container)
                            .addClass(this.bootstrapClasses.containerFluid);
                    } else {
                        this.$bs3Container.removeClass(this.bootstrapClasses.containerFluid)
                            .addClass(this.bootstrapClasses.container);
                    }

                    this.containerFluid = state;
                },
                _pSetColumnClass: '',
                /**
                 * Sets the columnClass class
                 * requires useBootstrap to be true
                 * @param colClass
                 */
                setColumnClass: function (colClass) {
                    if (!this.useBootstrap) {
                        $log.warn('Cannot set columnClass as useBootstrap is set to false, use bixWidth instead');
                        return;
                    }

                    colClass = colClass.toLowerCase();
                    var p;
                    switch (colClass) {
                        case 'xl':
                        case 'xlarge':
                            p = 'col-md-12';
                            break;
                        case 'l':
                        case 'large':
                            p = 'col-md-8 col-md-offset-2';
                            break;
                        case 'm':
                        case 'medium':
                            p = 'col-md-6 col-md-offset-3';
                            break;
                        case 's':
                        case 'small':
                            p = 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1';
                            break;
                        case 'xs':
                        case 'xsmall':
                            p = 'col-md-2 col-md-offset-5';
                            break;
                        default:
                            p = colClass;
                    }

                    this.$confirmBoxParent.removeClass(this._pSetColumnClass).addClass(p);
                    this._pSetColumnClass = p;
                },
                /**
                 * Set icon for the modal.
                 * @param iconClass
                 */
                setIcon: function (iconClass) {
                    if (typeof iconClass == 'function')
                        iconClass = iconClass();

                    if (iconClass) {
                        this.$icon.html(angular.element('<i></i>').addClass(iconClass));
                        this.$icon.removeClass(this._hideClass);
                    } else {
                        this.$icon.addClass(this._hideClass);
                    }

                    if (this.icon || this.title) {
                        this.$titleContainer.removeClass(this._hideClass);
                    } else {
                        this.$titleContainer.addClass(this._hideClass);
                    }

                    this.icon = iconClass;
                },
                /**
                 * set the title of the modal
                 * @param str
                 */
                setTitle: function (str) {
                    if (typeof str == 'function')
                        str = str();

                    if (str) {
                        this.$title.html(str);
                        this.$title.removeClass(this._hideClass);
                    } else {
                        this.$title.addClass(this._hideClass);
                    }

                    if (this.icon || this.title) {
                        this.$titleContainer.removeClass(this._hideClass);
                    } else {
                        this.$titleContainer.addClass(this._hideClass);
                    }

                    this.title = str;
                },
                /**
                 * Set the visibility of the close icon
                 * Will be visible if button count is 0 and closeIcon is null
                 * @param strFunc
                 */
                setCloseIcon: function (strFunc) {
                    if (this._buttonCount == 0 && strFunc == null)
                        strFunc = true;

                    if (!!strFunc)
                        this.$closeIcon.removeClass(this._hideClass);
                    else
                        this.$closeIcon.addClass(this._hideClass);

                    this.closeIcon = strFunc;
                },
                setCloseIconClass: function (iconClass) {
                    var iconEl;
                    if (iconClass) {
                        iconEl = angular.element('<i></i>').addClass(this.closeIconClass);
                    } else {
                        iconEl = angular.element('<span>&times;</span>').addClass(this.closeIconClass);
                    }
                    this.$closeIcon.html(iconEl);
                    this.closeIconClass = iconClass;
                },
                _animationPrefix: 'ng-confirm-animation-',
                _pSetAnimation: '',
                /**
                 * Set the start and end animations
                 * @param animation
                 * @private
                 */
                _setAnimationClass: function (animation) {
                    var c = this._prefixThis(animation, this._animationPrefix);
                    // remove the previously set animation and add the new one.
                    this.$confirmBox.removeClass(this._pSetAnimation).addClass(c);
                    this._pSetAnimation = c;
                },
                _removeAnimationClass: function () {
                    this.$confirmBox.removeClass(this._pSetAnimation);
                    this._pSetAnimation = '';
                },
                _bgDismissPrefix: 'ng-confirm-hilight-',
                _pSetDismissAnimation: '',
                /**
                 * Set the dismiss animations class
                 * @param animation
                 */
                setDismissAnimation: function (animation) {
                    var c = this._prefixThis(animation, this._bgDismissPrefix);
                    this.$confirmBox.removeClass(this._pSetDismissAnimation)
                        .addClass(c);
                    this._pSetDismissAnimation = c;
                },
                /**
                 * Prefix the strings with the given prefix,
                 * make no changes if its already prefixed.
                 * @param str
                 * @param pr
                 * @returns {string}
                 * @private
                 */
                _prefixThis: function (str, pr) {
                    str = str.split(',');
                    angular.forEach(str, function (a, k) {
                        if (a.indexOf(pr) == -1)
                            str[k] = pr + a.trim();
                    });
                    return str.join(' ').toLowerCase();
                },
                /**
                 * Parses the buttons and sets in the ngConfirm _scope.
                 * PLACED IN NG CONFIRM SCOPE.
                 *
                 * Setting buttons
                 * The user cannot add or remove buttons in run time.
                 * The user can however change the buttons properties.
                 *
                 * @param buttons
                 * @private
                 */
                _setButtons: function (buttons) {
                    var self = this;
                    if (typeof buttons != 'object')
                        buttons = {};

                    angular.forEach(buttons, function (button, key) {
                        if (typeof button === 'function') {
                            buttons[key] = button = {
                                action: button
                            };
                        }

                        buttons[key].text = button.text || key;
                        buttons[key].btnClass = button.btnClass || 'btn-default';
                        buttons[key].action = button.action || angular.noop;
                        buttons[key].keys = button.keys || [];
                        buttons[key].disabled = button.disabled || false;
                        if (typeof button.show == 'undefined')
                            button.show = true;
                        buttons[key].show = button.show;

                        angular.forEach(buttons[key].keys, function (a, i) {
                            buttons[key].keys[i] = a.toLowerCase();
                        });

                        var button_el = angular.element('<button type="button" class="btn"><span class="ng-confirm-btn-text"></span></button>');


                        buttons[key].setText = function (text) {
                            button_el.find('.ng-confirm-btn-text').html(text);
                        };
                        buttons[key].setBtnClass = function (btnClass) {
                            button_el.removeClass(buttons[key].btnClass).addClass(btnClass);
                            buttons[key].btnClass = btnClass;
                        };
                        buttons[key].setDisabled = function (state) {
                            if (state)
                                button_el.attr('disabled', 'disabled');
                            else
                                button_el.removeAttr('disabled');
                            buttons[key].disabled = state;
                        };
                        buttons[key].setShow = function (state) {
                            if (state)
                                button_el.removeClass(self._hideClass);
                            else
                                button_el.addClass(self._hideClass);

                            buttons[key].show = state;
                        };

                        buttons[key].setText(buttons[key].text);
                        buttons[key].setBtnClass(buttons[key].btnClass);
                        buttons[key].setDisabled(buttons[key].disabled);
                        buttons[key].setShow(buttons[key].show);

                        button_el.click(function (e) {
                            e.preventDefault();
                            self.triggerButton(key);
                        });

                        buttons[key].el = button_el;

                        self.$buttonContainer.append(button_el);
                    });

                    this.buttons = buttons;
                    this._buttonCount = Object.keys(buttons).length;
                },
                /**
                 * Buttons in the model.
                 */
                _buttonCount: 0,
                _themePrefix: 'ng-confirm-',
                _pSetTheme: '',
                /**
                 * sets the theme class
                 * @param theme
                 * @returns {string}
                 */
                setTheme: function (theme) {
                    var c = this._prefixThis(theme, this._themePrefix);
                    this.$el.removeClass(this._pSetTheme).addClass(c);
                    this._pSetTheme = c;
                },
                _rtlClass: 'ng-confirm-rtl',
                /**
                 * sets and removes the Right to left class
                 * @param state
                 */
                setRtl: function (state) {
                    if (state)
                        this.$el.addClass(this._rtlClass);
                    else
                        this.$el.removeClass(this._rtlClass);

                    this.rtl = state;
                },
                /**
                 * Sets the background opacity.
                 * @param opacity
                 */
                setBgOpacity: function (opacity) {
                    this.$confirmBg.css('opacity', opacity);
                    this.bgOpacity = opacity;
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
                _hash: function (str) {
                    var string = str.toString();
                    var hash = 0;
                    if (string.length == 0) return hash;
                    for (var i = 0; i < string.length; i++) {
                        var char = string.toString().charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash; // Convert to 32bit integer
                    }
                    return hash;
                },
                _digestWatchUnRegister: false,
                /**
                 * Bind all events.
                 *
                 * @returns {boolean}
                 * @private
                 */
                _bindEvents: function () {
                    var self = this;
                    // bind to scope digest
                    this._digestWatchUnRegister = this.scope.$watch(function () {
                        self.setDialogCenter('Digest watcher');
                    });
                    this.$closeIcon.on('click.' + self._id, function () {
                        self._closeClick();
                    });
                    angular.element(window).on('resize.' + self._id, function () {
                        self.setDialogCenter('Window Resize');
                    });
                    angular.element(window).on('keyup.' + self._id, function (e) {
                        self._reactOnKey(e);
                    });
                    this.$scrollPane.on('click', function () {
                        self._scrollPaneClick();
                    });
                    this.$confirmBox.on('click', function () {
                        self.boxClicked = true;
                    });
                },
                _unBindEvents: function () {
                    angular.element(window).off('resize.' + this._id);
                    angular.element(window).off('keyup.' + this._id);
                    this.$closeIcon.off('click.' + this._id);
                    if (this._digestWatchUnRegister)
                        this._digestWatchUnRegister();
                },
                _reactOnKey: function (e) {
                    var that = this;

                    var openedModals = angular.element('.ng-confirm');
                    if (openedModals.eq(openedModals.length - 1)[0] !== this.$el[0]) {
                        // if the event is called, and this modal is not the top most one, abort
                        return false;
                    }

                    var key = e.which;

                    if ($(this.$el).find(':input').is(':focus') && /13|32/.test(key)) {
                        return;
                    }

                    var keyChar = this._getKey(key);

                    if (keyChar === 'esc' && this.escapeKey) {
                        if (this.escapeKey == true) {
                            this._scrollPaneClick();
                        }
                        else if (typeof this.escapeKey == 'string' || typeof this.escapeKey == 'function') {
                            var buttonName = false;
                            if (typeof this.escapeKey == 'function') {
                                buttonName = this.escapeKey();
                            } else {
                                buttonName = this.escapeKey;
                            }

                            if (buttonName) {
                                if (!angular.isDefined(this.buttons[buttonName])) {
                                    $log.warn('Invalid escapeKey, no buttons found with name ' + buttonName);
                                } else {
                                    this._buttonClick(buttonName);
                                }
                            }
                        }
                    }

                    angular.forEach(this.buttons, function (button, key) {
                        if (button.keys.indexOf(keyChar) != -1)
                            that._buttonClick(key);
                    });
                },
                _scrollPaneClick: function () {
                    if (this.boxClicked) {
                        this.boxClicked = false;
                        return false;
                    }

                    var buttonName = false;
                    var shouldClose = false;
                    var str;

                    if (typeof this.backgroundDismiss == 'function')
                        str = this.backgroundDismiss();
                    else
                        str = this.backgroundDismiss;

                    if (typeof str == 'string' && angular.isDefined(this.buttons[str])) {
                        buttonName = str;
                        shouldClose = false;
                    } else if (typeof str == 'undefined' || !!(str) == true) {
                        shouldClose = true;
                    } else {
                        shouldClose = false;
                    }

                    if (buttonName) {
                        var btnResponse = this.buttons[buttonName].action.apply(this, [this.scope, this.buttons[buttonName]]);
                        shouldClose = (typeof btnResponse == 'undefined') || !!(btnResponse);
                    }

                    if (shouldClose)
                        this.close();
                    else
                        this.hiLightModal();
                },
                /**
                 * Called when close button is clicked.
                 * @private
                 */
                _closeClick: function () {
                    var buttonName = false;
                    var shouldClose = false;
                    var str;

                    if (typeof this.closeIcon == 'function') {
                        str = this.closeIcon();
                    } else {
                        str = this.closeIcon;
                    }

                    if (typeof str == 'string' && angular.isDefined(this.buttons[str])) {
                        buttonName = str;
                        shouldClose = false;
                    } else if (typeof str == 'undefined' || !!(str) == true) {
                        shouldClose = true;
                    } else {
                        shouldClose = false;
                    }

                    if (buttonName) {
                        var btnResponse = this.buttons[buttonName].action.apply(this, [this.scope, this.buttons[buttonName]]);
                        shouldClose = (typeof btnResponse == 'undefined' || !!(btnResponse) == true);
                    }
                    if (shouldClose) {
                        this.close();
                    }
                },
                _hilightAnimating: false,
                _hilightClass: 'ng-confirm-hilight',
                /**
                 * Hilight the modal.
                 * Whatever animation that is given to it.
                 */
                hiLightModal: function () {
                    var self = this;
                    if (this._hilightAnimating)
                        return;

                    this._hilightAnimating = true;
                    this.$confirmBox.addClass(this._hilightClass);
                    setTimeout(function () {
                        self._hilightAnimating = false;
                        self.$confirmBox.removeClass(self._hilightClass);
                    }, this.animationSpeed);
                },
                /**
                 * Button click function
                 *
                 * @param buttonKey
                 * @returns {*}
                 * @private
                 */
                _buttonClick: function (buttonKey) {
                    var res = this.buttons[buttonKey].action.apply(this, [this.scope, this.buttons[buttonKey]]);
                    if (typeof this.onAction === 'function')
                        this.onAction.apply(this, [this.scope, buttonKey]);

                    if (typeof res === 'undefined' || res)
                        this.close();
                    else
                        this.scope.$apply(); // if there are changes in the scope. apply it


                    return res;
                },
                /**
                 * Alias for _buttonClick
                 * Available for triggering buttons.
                 *
                 * @param buttonKey
                 * @returns {*}
                 */
                triggerButton: function (buttonKey) {
                    return this._buttonClick(buttonKey);
                },
                setDialogCenter: function (where) {
                    where = where || 'n/a'; // for debug
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
                    if (confirmBoxHeight == 0) {
                        // console.log(where, confirmBoxHeight);
                        return;
                    }
                    var boxHeight = (confirmBoxHeight - contentPaneHeight) + contentHeight;
                    var totalOffset = (this.offsetTop) + this.offsetBottom;
                    var style;
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
                    }).scrollTop(0);
                    this.$confirmBox.css(style);
                },
                _getKey: function (key) {
                    // special keys.
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
                    $timeout(function () {
                        that._open();
                    }, 100);

                    return true;
                },
                _open: function () {
                    var self = this;

                    if (typeof this.onOpenBefore == 'function')
                        this.onOpenBefore.apply(this, [this.scope]);

                    angular.element(this.container).append(this.$el);
                    self.setDialogCenter('_open');

                    setTimeout(function () {
                        // console.log(self.$el.html());
                        self.$contentPane.css(self._getCSS(self.animationSpeed, 1));
                        self.$confirmBox.css(self._getCSS(self.animationSpeed, self.animationBounce));
                        self._removeAnimationClass();
                        self.$confirmBg.removeClass('ng-confirm-bg-h');
                        self.$confirmBox.focus();

                        setTimeout(function () {
                            self._bindEvents();
                            self.$confirmBox.css(self._getCSS(self.animationSpeed, 1));
                            self._modalReady.resolve();

                            if (typeof self.onOpen === 'function')
                                self.onOpen.apply(self, [self.scope]);

                            self._startCountDown();
                        }, self.animationSpeed);
                    }, 100);
                },
                _autoCloseKey: false,
                _autoCloseInterval: 0,
                _startCountDown: function () {
                    var self = this;
                    if (typeof this.autoClose != 'string') return;
                    var opt = this.autoClose.split('|');
                    if (opt.length != 2) {
                        $log.error("Invalid option for autoClose. example 'close|10000'");
                        return;
                    }

                    this._autoCloseKey = opt[0];
                    var time = opt[1];
                    var sec = time / 1000;

                    if (!angular.isDefined(this.buttons[this._autoCloseKey])) {
                        $log.error('Auto close button "' + self._autoCloseKey + '" not defined.');
                        return;
                    }

                    var timer_el = angular.element('<span class="ng-confirm-timer"></span>');
                    this.buttons[this._autoCloseKey].el.append(timer_el);

                    this._autoCloseInterval = setInterval(function () {
                        var s = sec ? " (" + (--sec) + ")" : "";
                        timer_el.html(s);
                        if (sec < 1) {
                            self._stopCountDown();
                            self._buttonClick(self._autoCloseKey);
                        }
                    }, 1000);
                },
                _stopCountDown: function () {
                    if (this._autoCloseInterval) {
                        clearInterval(this._autoCloseInterval);
                    }
                },
                closed: false,
                isClosed: function () {
                    return this.closed;
                },
                isOpen: function () {
                    return !this.closed;
                },
                close: function () {
                    var self = this;
                    if (typeof this.onClose === 'function')
                        this.onClose.apply(this, [this.scope]);

                    this._unBindEvents();
                    this._stopCountDown();

                    this._setAnimationClass(this.closeAnimation);
                    this.$confirmBg.addClass('ng-confirm-bg-h');
                    var closeTimer = this.animationSpeed * .4;

                    setTimeout(function () {
                        self.$el.remove();
                        self.closed = true;
                        if (!self._providedScope)
                            self.scope.$destroy();

                        if (typeof self.onDestroy == 'function')
                            self.onDestroy.apply(self, [self.scope]);

                        angular.element('body').removeClass('ng-confirm-no-scroll-' + self._id);
                        self._lastFocused.focus();
                        self = undefined;
                    }, closeTimer);

                    return true;
                }
            };

            return ngConfirmBase;
        }
    ]);