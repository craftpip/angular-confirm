### ![jquery-confirm](https://raw.githubusercontent.com/craftpip/angular-confirm/master/angular-confirm.png "jquery-confirm")
*alerts, confirms and dialogs in* ***one.***

v1.0.0

Angular-confirm targets to make it really easy to use confirm dialogs with angular.  
With angular-confirm you can harness the angular two-way data binding to update the content as well as make changes to the model in runtime. 

A re-write of the jquery-confirm v3 plugin with all features.

* Define multiple buttons
* Trigger buttons on key up events
* Beautiful themes and animations
* All modal properties are two-way binded.  
* Do things the angular way

View detailed features here [Documentation & Examples](http://craftpip.github.io/angular-confirm)

## Installation

Download the latest release [here](https://github.com/craftpip/jquery-confirm/archive/master.zip) and use the files within the `dist` directory

* bower, npm are coming soon.

##Basic usage

The snippet below shows the most commonly used properties, there are more to find in the docs.
```js
angular.module('myApp', ['cp.ngConfirm'])
.controller('myController', function($scope, $ngConfirm){
    $scope.hey = 'Hello there!';
    $ngConfirm({
        title: 'What is up?',
        content: 'Here goes a little content, <strong>{{hey}}</strong>',
        contentUrl: 'template.html', // if contentUrl is provided, 'content' is ignored.
        scope: $scope,
        buttons: {   
            ok: {
                text: "ok!",
                btnClass: 'btn-primary',
                keys: ['enter'], // will trigger when enter is pressed
                action: function($scope){
                     console.log('the user clicked ok');
                }
            },
            close: function($scope){
                console.log('the user clicked close');
            }
        },
    });
});
```

## Demo and Documentation

See Detailed Docs + Example [here](http://craftpip.github.io/angular-confirm).

## Issues

Please post issues and feature request here [Github issues](https://github.com/craftpip/angular-confirm/issues)

## Copyright and license

Copyright (C) 2016 angular-confirm

Licensed under [the MIT license](LICENSE).

