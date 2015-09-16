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
        public scope: any = { options: '=', status: '=', showFooter: '=', abSize: '@', name: '@' };
        public link = (scope: any, element: any, attrs: any) => {
            this.$log.debug('init perfect scrollbar');
            this.PsUtils.initialize(element[0].firstChild.querySelector('.ab-grid .ag-body-viewport'));

            switch(attrs.abSize) {
                case 'small':
                    element.addClass('ab-sm');
                    break;
                default:
                    break;
            }
        };
        public template: string =
                '<div class="panel panel-default ab-grid">' +
                    '<div class="panel-heading" ng-transclude>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        '<div ag-grid="options" class="ag-fresh ag-noborder"></div>' +
                    '</div>' +
                    '<div class="panel-footer text-center" ng-show="showFooter">' +
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

        constructor(protected PsUtils: ABGrid.IPsUtils) {}

        public require: string = '^abGrid';
        public restrict: string = 'E';
        public transclude: boolean = true;
        public replace: boolean = true;
        //public scope: any = {};
        public controller: string = 'ABGridToolboxCtrl';
        public link = (scope: any, element: any) => {
            var psContainer: any = element[0].querySelector('.sencond-list');
            this.PsUtils.initialize(psContainer);
        };
        public template: string =
                '<div class="panel-heading-toolbox" role="toolbar" aria-label="...">' +
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

    export interface IGridScope extends ng.IScope {
        options: any;
        name: string;
        Ctrl: ABGridCtrl;
    }

    export interface ICustomerScope extends ng.IScope {
        $parent: any;
        abChanged: any;
        showColumns: boolean;
        Ctrl: ABGridToolboxCtrl;
    }

    export class ABGridCtrl {
        constructor(protected $scope: ABGrid.IGridScope,
                protected GridStatus: typeof ABGrid.GridStatus,
                protected $timeout: ng.ITimeoutService) {
            var status: any = new this.GridStatus();
            var name: string = $scope.name;
            $scope.options.columnDefs.forEach((col: any) => {
                var locale: string = localStorage.getItem('ab-grid-col-' + name + '-' + col.field + '-show');
                switch(locale) {
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

            $timeout(function() {
                $scope.options.api.status = status;
            });
        }
    }

    export class ABGridToolboxCtrl {
        constructor(protected $scope: ABGrid.ICustomerScope,
                protected $timeout: ng.ITimeoutService) {

            var name: string = $scope.$parent.name;

            $scope.showColumns = false;

            $scope.abChanged = (col: any) => {
                col.hide = !col.show;
                localStorage.setItem('ab-grid-col-' + name + '-' + col.field + '-show', col.show);
                this.$timeout(() => {
                    $scope.$parent.options.columnApi.hideColumn(col.field, col.hide);
                });

            };
        }
    }

    app.controller('ABGridCtrl',  ['$scope', 'GridStatus', '$timeout', ABGrid.ABGridCtrl]);
    app.controller('ABGridToolboxCtrl', ['$scope', '$timeout', ABGrid.ABGridToolboxCtrl]);
    app.factory('PsUtils', ['$window', ($window: ABGrid.IWindow) => new ABGrid.PsUtils($window)]);
    app.factory('GridStatus', [() => ABGrid.GridStatus]);
    app.factory('ABGrid', ['$timeout', '$window', ($timeout: ng.ITimeoutService, $window: ng.IWindowService) => new ABGrid.GridService($timeout, $window)]);
    app.directive("abGrid", ['$log', 'PsUtils', ($log: ng.ILogService, PsUtils: ABGrid.PsUtils) => new ABGrid.ABGridDirective($log, PsUtils)]);
    app.directive("abGridTitle", [() => new ABGrid.ABGridTtile()]);
    app.directive("abGridToolbox", ['PsUtils', (PsUtils: ABGrid.PsUtils) => new ABGrid.ABGridToolbox(PsUtils)]);
    app.directive("abGridToolboxBtn", [() => new ABGrid.ABGridToolboxBtn()]);
    app.directive("abGridToolboxDelimiter", [() => new ABGrid.ABGridToolboxDelimiter()]);
    app.directive("abGridSearch", [() => new ABGrid.ABGridSearch()]);
}
