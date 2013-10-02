/*global angular*/
(function (angular) {
    'use strict';

    angular.module('JsontypecompareApp').filter('markerrors', function () {
        return function (input) {
            var str,
                strEqualFalse = '"equal": false',
                equalFalse = new RegExp(strEqualFalse, "g");

            if (input) {
                str = input.replace(equalFalse, '<span class="error">' + strEqualFalse +'</span>')
            }

            return str;
        };
    });

}(angular));
