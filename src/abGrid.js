/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="gridStatus.ts"/>
/// <reference path="./psUtils.ts"/>
/// <reference path="./gridService"/>
var ABGrid;
(function (ABGrid) {
    var app = angular.module('ABGrid', []);
    var ABGridDirective = (function () {
        function ABGridDirective($log, PsUtils) {
            var _this = this;
            this.$log = $log;
            this.PsUtils = PsUtils;
            this.restrict = "E";
            this.transclude = true;
            this.replace = false;
            this.controller = 'ABGridCtrl';
            this.controllerAs = 'grid';
            this.scope = { options: '=', status: '=', showFooter: '=', abSize: '@', name: '@' };
            this.link = function (scope, element, attrs) {
                _this.$log.debug('init perfect scrollbar');
                _this.PsUtils.initialize(element[0].firstChild.querySelector('.ab-grid .ag-body-viewport'));
                switch (attrs.abSize) {
                    case 'small':
                        element.addClass('ab-sm');
                        break;
                    default:
                        break;
                }
            };
            this.template = '<div class="panel panel-default ab-grid">' +
                '<div class="panel-heading" ng-transclude>' +
                '</div>' +
                '<div class="panel-body">' +
                '<div ag-grid="options" class="ag-fresh ag-noborder"></div>' +
                '</div>' +
                '<div class="panel-footer text-center" ng-show="showFooter">' +
                '</div>' +
                '</div>';
        }
        return ABGridDirective;
    })();
    ABGrid.ABGridDirective = ABGridDirective;
    var ABGridTtile = (function () {
        function ABGridTtile() {
            this.require = '^abGrid';
            this.restrict = 'E';
            this.transclude = true;
            this.replace = true;
            this.template = '<div class="panel-heading-title" ng-transclude></div>';
        }
        return ABGridTtile;
    })();
    ABGrid.ABGridTtile = ABGridTtile;
    var ABGridToolbox = (function () {
        function ABGridToolbox(PsUtils) {
            var _this = this;
            this.PsUtils = PsUtils;
            this.require = '^abGrid';
            this.restrict = 'E';
            this.transclude = true;
            this.replace = true;
            this.controller = 'ABGridToolboxCtrl';
            this.link = function (scope, element) {
                var psContainer = element[0].querySelector('.sencond-list');
                _this.PsUtils.initialize(psContainer);
            };
            this.template = '<div class="panel-heading-toolbox" role="toolbar" aria-label="...">' +
                '<div class="btn-group btn-group-sm" role="group" aria-label="..." ng-transclude>' +
                '</div>' +
                '<div class="btn-group btn-group-sm" dropdown keyboard-nav auto-close="outsideClick">' +
                '<button id="simple-btn-keyboard-nav" type="button" class="btn btn-darkslategrey btn-clear" dropdown-toggle>' +
                'settings <span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu" role="menu" aria-labelledby="simple-btn-keyboard-nav">' +
                '<li role="menuitem" ng-mouseenter="showColumns = true" ng-mouseleave="showColumns">' +
                '<a href="#">Columns</a>' +
                '<ul class="list-group sencond-list" ng-show="showColumns">' +
                '<li class="list-group-item" ng-repeat="col in $parent.options.columnDefs">' +
                '<div class="checkbox">' +
                '<label>' +
                '<input type="checkbox" ng-model="col.show" ng-change="abChanged(col)"> {{col.headerName}}' +
                '</label>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="menuitem" ng-mouseenter="showColumns = false"><a href="#">Another</a></li>' +
                '<li role="menuitem" ng-mouseenter="showColumns = false"><a href="#">Something</a></li>' +
                '<li class="divider" ng-mouseenter="showColumns = false"></li>' +
                '<li role="menuitem" ng-mouseenter="showColumns = false"><a href="#">Separated</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>';
        }
        return ABGridToolbox;
    })();
    ABGrid.ABGridToolbox = ABGridToolbox;
    var ABGridToolboxBtn = (function () {
        function ABGridToolboxBtn() {
            this.require = '^abGridToolbox';
            this.restrict = 'E';
            this.transclude = true;
            this.replace = true;
            this.scope = { clickFun: '&btnClick' };
            this.template = '<button type="button" class="btn btn-darkslategrey btn-clear" ' +
                'ng-click="clickFun()" ng-transclude>' +
                '</button>';
        }
        return ABGridToolboxBtn;
    })();
    ABGrid.ABGridToolboxBtn = ABGridToolboxBtn;
    var ABGridToolboxDelimiter = (function () {
        function ABGridToolboxDelimiter() {
            this.require = '^abGridToolbox';
            this.restrict = 'E';
            this.transclude = true;
            this.replace = true;
            this.template = '<span class="toolbox-delimiter"></span>';
        }
        return ABGridToolboxDelimiter;
    })();
    ABGrid.ABGridToolboxDelimiter = ABGridToolboxDelimiter;
    var ABGridSearch = (function () {
        function ABGridSearch() {
            this.require = '^abGrid';
            this.restrict = 'E';
            this.replace = true;
            this.controller = function ($scope, $log) {
                $log.debug($scope.$parent.options);
            };
            this.template = '<form class="form-inline pull-right">' +
                '<div class="form-group form-group-ssm has-feedback" id="attr-search">' +
                '<label class="control-label sr-only" for="baseFilterText">Hidden label</label>' +
                '<input ng-model="$parent.options.quickFilterText" type="search" class="form-control" id="baseFilterText" aria-describedby="sensorFilterTextStatus">' +
                '<span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>' +
                '<span id="sensorFilterTextStatus" class="sr-only">(success)</span>' +
                '</div>' +
                '</form>';
        }
        return ABGridSearch;
    })();
    ABGrid.ABGridSearch = ABGridSearch;
    var ABGridCtrl = (function () {
        function ABGridCtrl($scope, GridStatus, $timeout) {
            this.$scope = $scope;
            this.GridStatus = GridStatus;
            this.$timeout = $timeout;
            var status = new this.GridStatus();
            var name = $scope.name;
            $scope.options.columnDefs.forEach(function (col) {
                var locale = localStorage.getItem('ab-grid-col-' + name + '-' + col.field + '-show');
                switch (locale) {
                    case 'true':
                        col.show = true;
                        break;
                    case 'false':
                        col.show = false;
                        col.hide = true;
                        break;
                    default:
                        col.show = true;
                }
            });
            $timeout(function () {
                $scope.options.api.status = status;
            });
        }
        return ABGridCtrl;
    })();
    ABGrid.ABGridCtrl = ABGridCtrl;
    var ABGridToolboxCtrl = (function () {
        function ABGridToolboxCtrl($scope, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            var name = $scope.$parent.name;
            $scope.showColumns = false;
            $scope.abChanged = function (col) {
                col.hide = !col.show;
                localStorage.setItem('ab-grid-col-' + name + '-' + col.field + '-show', col.show);
                _this.$timeout(function () {
                    $scope.$parent.options.columnApi.hideColumn(col.field, col.hide);
                });
            };
        }
        return ABGridToolboxCtrl;
    })();
    ABGrid.ABGridToolboxCtrl = ABGridToolboxCtrl;
    app.controller('ABGridCtrl', ['$scope', 'GridStatus', '$timeout', ABGrid.ABGridCtrl]);
    app.controller('ABGridToolboxCtrl', ['$scope', '$timeout', ABGrid.ABGridToolboxCtrl]);
    app.factory('PsUtils', ['$window', function ($window) { return new ABGrid.PsUtils($window); }]);
    app.factory('GridStatus', [function () { return ABGrid.GridStatus; }]);
    app.factory('ABGrid', ['$timeout', '$window', function ($timeout, $window) { return new ABGrid.GridService($timeout, $window); }]);
    app.directive("abGrid", ['$log', 'PsUtils', function ($log, PsUtils) { return new ABGrid.ABGridDirective($log, PsUtils); }]);
    app.directive("abGridTitle", [function () { return new ABGrid.ABGridTtile(); }]);
    app.directive("abGridToolbox", ['PsUtils', function (PsUtils) { return new ABGrid.ABGridToolbox(PsUtils); }]);
    app.directive("abGridToolboxBtn", [function () { return new ABGrid.ABGridToolboxBtn(); }]);
    app.directive("abGridToolboxDelimiter", [function () { return new ABGrid.ABGridToolboxDelimiter(); }]);
    app.directive("abGridSearch", [function () { return new ABGrid.ABGridSearch(); }]);
})(ABGrid || (ABGrid = {}));
