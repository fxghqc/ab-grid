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
            this.scope = { options: '=', status: '=', showFooter: '=' };
            this.link = function (scope, element) {
                _this.$log.debug('init perfect scrollbar');
                _this.PsUtils.initialize(element[0].firstChild.querySelector('.ab-grid .ag-body-viewport'));
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
        function ABGridToolbox() {
            this.require = '^abGrid';
            this.restrict = 'E';
            this.transclude = true;
            this.replace = true;
            this.template = '<div class="panel-heading-toolbox btn-group btn-group-sm" ' +
                'role="group" aria-label="..." ng-transclude>' +
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
            $timeout(function () {
                $scope.options.api.status = status;
            });
        }
        return ABGridCtrl;
    })();
    ABGrid.ABGridCtrl = ABGridCtrl;
    app.controller('ABGridCtrl', ['$scope', 'GridStatus', '$timeout', ABGrid.ABGridCtrl]);
    app.factory('PsUtils', ['$window', function ($window) { return new ABGrid.PsUtils($window); }]);
    app.factory('GridStatus', [function () { return ABGrid.GridStatus; }]);
    app.factory('ABGrid', ['$timeout', '$window', function ($timeout, $window) { return new ABGrid.GridService($timeout, $window); }]);
    app.directive("abGrid", ['$log', 'PsUtils', function ($log, PsUtils) { return new ABGrid.ABGridDirective($log, PsUtils); }]);
    app.directive("abGridTitle", [function () { return new ABGrid.ABGridTtile(); }]);
    app.directive("abGridToolbox", [function () { return new ABGrid.ABGridToolbox(); }]);
    app.directive("abGridToolboxBtn", [function () { return new ABGrid.ABGridToolboxBtn(); }]);
    app.directive("abGridToolboxDelimiter", [function () { return new ABGrid.ABGridToolboxDelimiter(); }]);
    app.directive("abGridSearch", [function () { return new ABGrid.ABGridSearch(); }]);
})(ABGrid || (ABGrid = {}));
