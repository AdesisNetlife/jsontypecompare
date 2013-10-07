"use strict";angular.module("JsontypecompareApp",["ngRoute","ngSanitize"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),function(a){a.module("JsontypecompareApp").controller("MainCtrl",["$scope","ComparatorSrv","ReporterSrv",function(a,b,c){function d(a){var b=String.fromCharCode(160),c=new RegExp(b,"g");return a.replace(c," ")}var e,f;a.pretty=!0,a.order=!0,a.validDocuments=!1,a.validLeftDocument=!1,a.validRightDocument=!1,a.prettifyLeft=function(){a.pretty&&e&&(a.order&&(e=c.sortProperties(e)),a.leftValue=JSON.stringify(e,!0,"  "))},a.prettifyRight=function(){a.pretty&&f&&(a.order&&(f=c.sortProperties(f)),a.rightValue=JSON.stringify(f,!0,"  "))},a.$watch("leftValue",function(b){if(e=null,a.validLeftDocument=!1,b){try{e=JSON.parse(d(b)),a.validLeftDocument=!0}catch(c){a.validLeftDocument=!1}a.validDocuments=a.validLeftDocument&&a.validRightDocument}}),a.$watch("rightValue",function(b){if(f=null,a.validRightDocument=!1,b){try{f=JSON.parse(d(b)),a.validRightDocument=!0}catch(c){a.validRightDocument=!1}a.validDocuments=a.validLeftDocument&&a.validRightDocument}}),a.compare=function(){a.comparison=b.compare(e,f),a.differences=c.generateDifferencesReport(a.comparison)}}])}(angular),function(a){a.module("JsontypecompareApp").directive("contenteditable",function(){return{require:"ngModel",link:function(a,b,c,d){b.on("blur",function(){a.$apply(function(){d.$setViewValue(b.html())})}),d.$render=function(a){b.html(a)},d.$setViewValue(b.text())}}})}(angular),function(a){function b(a,b){return a.type!==b.type?{equal:!1,leftType:a.type,rightType:b.type}:e(a.properties,b.properties)}var c,d,e,f,g;c=function(a){var b;for(b in a)if(a.hasOwnProperty(b)&&!a[b].equal)return!1;return!0},d=function(b,c){var d={type:"array"};return"mixed"===b.arrayType||"mixed"===c.arrayType?(d.leftArrayType=b.arrayType,d.rightArrayType=c.arrayType,d.equal=!1):b.arrayType===c.arrayType?(d.arrayType=b.arrayType,"object"===d.arrayType?a.extend(d,e(b.properties,c.properties)):d.equal=!0):"unknown"===b.arrayType?(d.arrayType=c.arrayType,d.equal=!0):"unknown"===c.arrayType?(d.arrayType=b.arrayType,d.equal=!0):(d.leftArrayType=b.arrayType,d.rightArrayType=c.arrayType,d.equal=!1),d},f=function(a,b,c){var f,g,h,i={};for(f in c)c.hasOwnProperty(f)&&(g=a[f],h=b[f],g.type===h.type?"object"===g.type?(i[f]=e(g.properties,h.properties),i[f].type="object"):"array"===g.type?i[f]=d(g,h):(i[f]=g,g.equal=!0):i[f]={equal:!1,leftType:g.type,rightType:h.type});return i},g=function(a,b,c){var d,e={};for(d in b)b.hasOwnProperty(d)&&(a[d].equal=!1,a[d].missing=c,e[d]=a[d]);return e},e=function(b,d){var e,h={},i={},j={},k={};for(e in b)b.hasOwnProperty(e)&&(i[e]=!0);for(e in d)d.hasOwnProperty(e)&&(i[e]?(delete i[e],h[e]=!0):j[e]=!0);return a.extend(k,g(b,i,"right")),a.extend(k,g(d,j,"left")),a.extend(k,f(b,d,h)),{properties:k,equal:c(k)}},a.module("JsontypecompareApp").service("ComparatorSrv",["DescriptorSrv",function(a){this.compare=function(c,d){var e,f,g;return c===d?{equal:!0,same:!0}:null===c?{equal:!1,missing:"left"}:null===d?{equal:!1,missing:"right"}:(e=a.generateDescription(c),f=a.generateDescription(d),g=b(e,f))}}])}(angular),function(a){var b,c,d,e,f,g;e=function(a){var b={};return a.forEach(function(a){var c,d=g(a);for(c in d)d.hasOwnProperty(c)&&(b[c]?b[c].type!==d[c].type&&(b[c].type="mixed"):b[c]=d[c])}),b},c=function(a){var b;for(b in a)if(a.hasOwnProperty(b)&&"mixed"===a[b].type)return!0;return!1},d=function(a){var b={};return a.forEach(function(a){var c=typeof a;b.arrayType?c!==b.arrayType&&(b.arrayType="mixed"):b.arrayType=c}),"object"===b.arrayType&&(b.properties=e(a),c(b.properties)&&(b.arrayType="mixed")),b.arrayType||(b.arrayType="unknown"),b},b=function(b,c){var e;return e={type:a.isArray(b[c])?"array":typeof b[c]},"object"===e.type&&(e.properties=g(b[c])),"array"===e.type&&a.extend(e,d(b[c])),e},g=function(a){var c,d={};for(c in a)a.hasOwnProperty(c)&&(d[c]=b(a,c));return d},f=function(c){if(a.isArray(c))return a.extend({type:"array"},d(c));var e,f={};for(e in c)c.hasOwnProperty(e)&&(f[e]=b(c,e));return{type:"object",properties:f}},a.module("JsontypecompareApp").service("DescriptorSrv",function(){this.generateDescription=f})}(angular),function(a){function b(a,b,c){var d={path:(c||"")+b};return a.type?a.missing?(d.errorType="missing",d.missing=a.missing):"array"===a.type?a.arrayType?d.errorType="children":(d.errorType="arrayType",d.leftArrayType=a.leftArrayType,d.rightArrayType=a.rightArrayType):d.errorType="children":(d.errorType="type",d.leftType=a.leftType,d.rightType=a.rightType),d}function c(a,b,c){var d=a||"";return d+=b,"array"===c.type&&(d+="[]"),d+="."}function d(a,e,f){var g,h,i;if(!e.equal){h=e.properties;for(g in h)h.hasOwnProperty(g)&&(h[g].equal||(a.push(b(h[g],g,f)),i=c(f,g,h[g]),d(a,h[g],i)))}}function e(a){var b=[];return d(b,a),b}function f(a){var b;for(b=0;b<a.length;b+=1)a[b]&&(a[b]=h(a[b]));return a}function g(a){var b,c,d,e=[],f={};for(c in a)a.hasOwnProperty(c)&&e.push(c);for(e.sort(),b=0;b<e.length;b+=1)d=a[e[b]],f[e[b]]="object"==typeof d?h(d):d;return f}function h(b){return a.isArray(b)?f(b):"object"==typeof b?g(b):b}a.module("JsontypecompareApp").service("ReporterSrv",function(){this.generateDifferencesReport=e,this.sortProperties=h})}(angular),function(a){a.module("JsontypecompareApp").filter("markerrors",function(){return function(a){var b,c='"equal": false',d=new RegExp(c,"g");return a&&(b=a.replace(d,'<span class="error">'+c+"</span>")),b}})}(angular);