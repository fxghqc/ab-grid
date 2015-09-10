/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="gridStatus.ts"/>
/// <reference path="./psUtils.ts"/>
/// <reference path="./gridService"/>

module ABGrid {
    var app = angular.module('ABGrid', []);

    export class ABGridDirective implements ng.IDirective {
        constructor(protected $log: ng.ILogService,
                protected PsUtils: ABGrid.IPsUtils) {
        }

        public restrict: string = "E";
        public transclude: boolean = true;
        public replace: boolean = false;
        public controller: string = 'ABGridCtrl';
        public controllerAs: string = 'grid';
        public scope: any = { options: '=', status: '=' };
        public link = (scope: any, element: any) => {
            this.$log.debug('init perfect scrollbar');
            this.PsUtils.initialize(element[0].firstChild.querySelector('.ab-grid .ag-body-viewport'));
        };
        public template: string =
                '<div class="panel panel-default ab-grid">' +
                    '<div class="panel-heading" ng-transclude>' +
                    '</div>' +
                    '<div class="panel-body no-padding">' +
                        '<div ag-grid="options" class="ag-fresh ag-noborder"></div>' +
                    '</div>' +
                    '<div class="panel-footer text-center">' +
                    '</div>' +
                '</div>';
    }

    export class ABGridTtile implements ng.IDirective {
        public require: string = '^abGrid';
        public restrict: string = 'E';
        public transclude: boolean = true;
        public replace: boolean = true;
        public template: string =
                '<div class="panel-heading-title" ng-transclude></div>';
    }

    export class ABGridToolbox implements ng.IDirective {
        public require: string = '^abGrid';
        public restrict: string = 'E';
        public transclude: boolean = true;
        public replace: boolean = true;
        public template: string =
                '<div class="panel-heading-toolbox btn-group btn-group-sm" ' +
                    'role="group" aria-label="..." ng-transclude>' +
                '</div>';
    }

    export class ABGridToolboxBtn implements ng.IDirective {
        public require: string = '^abGridToolbox';
        public restrict: string = 'E';
        public transclude: boolean = true;
        public replace: boolean = true;
        public scope: any = { clickFun: '&btnClick' };
        public template: string =
                '<button type="button" class="btn btn-darkslategrey btn-clear" ' +
                    'ng-click="clickFun()" ng-transclude>' +
                '</button>';
    }

    export class ABGridToolboxDelimiter implements ng.IDirective {
        public require: string = '^abGridToolbox';
        public restrict: string = 'E';
        public transclude: boolean = true;
        public replace: boolean = true;
        public template: string =
                '<span class="toolbox-delimiter"></span>';
    }

    export class ABGridSearch implements ng.IDirective {
        public require: string = '^abGrid';
        public restrict: string = 'E';
        public replace: boolean = true;
        public controller = ($scope: any, $log: any) => {
            $log.debug($scope.$parent.options);
        };
        public template: string =
                '<form class="form-inline pull-right">' +
                  '<div class="form-group form-group-ssm has-feedback" id="attr-search">' +
                    '<label class="control-label sr-only" for="baseFilterText">Hidden label</label>' +
                    '<input ng-model="$parent.options.quickFilterText" type="search" class="form-control" id="baseFilterText" aria-describedby="sensorFilterTextStatus">' +
                    '<span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>' +
                    '<span id="sensorFilterTextStatus" class="sr-only">(success)</span>' +
                  '</div>' +
                '</form>';
    }

    export interface ICustomerSearchScope  extends ng.IScope {
        options: any;
        Ctrl: ABGridCtrl;
    }

    export class ABGridCtrl {
        constructor(protected $scope: ABGrid.ICustomerSearchScope,
                protected GridStatus: ABGrid.IGridStatus,
                protected $timeout: ng.ITimeoutService) {
            $timeout(function() {
                $scope.options.api.status = new this.GridStatus();
            });
        }
    }

    app.controller('ABGridCtrl',  ['$scope', 'GridStatus', '$timeout', ABGrid.ABGridCtrl]);
    app.factory('PsUtils', ['$window', ($window: ABGrid.IWindow) => new ABGrid.PsUtils($window)]);
    app.factory('ABGrid', ['$timeout', '$window', ($timeout: ng.ITimeoutService, $window: ng.IWindowService) => new ABGrid.GridService($timeout, $window)]);
    app.directive("abGrid", ['$log', 'PsUtils', ($log: ng.ILogService, PsUtils: ABGrid.PsUtils) => new ABGrid.ABGridDirective($log, PsUtils)]);
    app.directive("abGridTitle", [() => new ABGrid.ABGridTtile()]);
    app.directive("abGridToolbox", [() => new ABGrid.ABGridToolbox()]);
    app.directive("abGridToolboxBtn", [() => new ABGrid.ABGridToolboxBtn()]);
    app.directive("abGridToolboxDelimiter", [() => new ABGrid.ABGridToolboxDelimiter()]);
    app.directive("abGridSearch", [() => new ABGrid.ABGridSearch()]);
}
