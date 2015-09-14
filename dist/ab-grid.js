/**
 * ab-grid - angular bootstrap data grid
 * @version v0.1.0
 * @link https://github.com/fxghqc/ab-grid#readme
 * @license MIT
 */
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts"/>
var ABGrid;
(function (ABGrid) {
    var GridStatus = (function () {
        function GridStatus() {
            this.newRows = [];
            this.dirtyCells = [];
        }
        GridStatus.prototype.whenRowAdded = function (data) {
            this.isDirty = true;
            this.hasNewRow = true;
            this.newRows.push(data);
        };
        GridStatus.prototype.whenRowsRemoved = function (data) {
            _.remove(this.newRows, function (row) {
                return row === data;
            });
            _.remove(this.dirtyCells, function (cell) {
                return cell.data === data;
            });
            if (this.newRows.length < 1) {
                this.hasNewRow = false;
            }
        };
        GridStatus.prototype.whenEdited = function () {
            this.isDirty = true;
        };
        GridStatus.prototype.dirtyCell = function (colDef, data) {
            this.dirtyCells.push({ colDef: colDef, data: data });
        };
        GridStatus.prototype.isDirtyCell = function (colDef, data) {
            var index = _.findIndex(this.dirtyCells, { colDef: colDef, data: data });
            return index >= 0;
        };
        return GridStatus;
    })();
    ABGrid.GridStatus = GridStatus;
})(ABGrid || (ABGrid = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
var ABGrid;
(function (ABGrid) {
    var PsUtils = (function () {
        function PsUtils($window) {
            this.$window = $window;
        }
        PsUtils.prototype.initialize = function (element) {
            if (this.isPerfect === undefined &&
                (this.$window.navigator.userAgent.indexOf('Mac') >= 0)) {
                this.isPerfect = true;
            }
            if (this.isPerfect) {
                return;
            }
            this.$window.Ps.initialize(element);
        };
        return PsUtils;
    })();
    ABGrid.PsUtils = PsUtils;
})(ABGrid || (ABGrid = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
var ABGrid;
(function (ABGrid) {
    var GridService = (function () {
        /*
         * constructor:
         *
         * @param $timeout
         * @param $window
         */
        function GridService($timeout, $window) {
            this.$timeout = $timeout;
            this.$window = $window;
        }
        GridService.prototype.selectEditor = function (options) {
            var eSelect = this.$window.document.createElement('select');
            var emptyOption = this.$window.document.createElement('option');
            emptyOption.setAttribute('value', '');
            emptyOption.innerHTML = '-- 请选择 --';
            eSelect.appendChild(emptyOption);
            options.forEach(function (item) {
                var eOption = this.$window.document.createElement('option');
                eOption.setAttribute('value', item);
                eOption.innerHTML = item;
                eSelect.appendChild(eOption);
            });
            eSelect.className = 'ag-cell-edit-select';
            return eSelect;
        };
        GridService.prototype.resizeGrid = function (api, exec) {
            var _this = this;
            this.$timeout(function () {
                api.sizeColumnsToFit();
                exec();
                _this.$timeout(function () {
                    api.sizeColumnsToFit();
                    exec();
                }, 10);
            });
        };
        return GridService;
    })();
    ABGrid.GridService = GridService;
})(ABGrid || (ABGrid = {}));
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
            this.scope = { options: '=', status: '=', showFooter: '=', abSize: '@' };
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
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts"/>
var ABGrid;
(function (ABGrid) {
    var GridValidation = (function () {
        function GridValidation($log, _, GridErrorProxy) {
            this.$log = $log;
            this._ = _;
            this.GridErrorProxy = GridErrorProxy;
        }
        /**
         * this is not a good function, it's a reminder;
         */
        GridValidation.prototype.compareValue = function (oldValue, newValue, validator) {
            // var oldInvalid = validator(oldValue);
            // var newInvalid = validator(newValue);
            //
            // var valid = true;
            //
            // if (!oldInvalid && !newInvalid && oldValue === newValue) {
            // return 'values do not changed!';
            // }
            //
            // if (oldInvalid && (!node.errors || !node.errors[field])) {
            //
            // if (newInvalid) {
            //
            //   valid = false;
            // }
            //
            // } else {
            //
            // if (!oldInvalid && !newInvalid) {
            //
            //   Log.write('values keeps valid!');
            //
            // } else if (oldInvalid && newInvalid) {
            //
            //   Log.write('values keeps invalid!');
            //
            // } else if (oldInvalid && !newInvalid) {
            //
            //   api.removeError(node, params.colDef);
            //   Log.write('values is valid!');
            //
            // } else if (!oldInvalid && newInvalid) {
            //
            //   api.addError(node, params.colDef, '不能为空！');
            //   Log.write('values is invalid!');
            // }
            //
            // }
        };
        GridValidation.prototype.notNullValidation = function (params) {
            var field = params.colDef.field;
            var headerName = params.colDef.headerName;
            var newValue = params.newValue;
            var newInvalid = _.isEmpty(newValue);
            var api = params.api;
            api.status.dirtyCell(params.colDef, params.data);
            if (newInvalid) {
                // TODO: 优化，某些确定存在的情况，无需添加
                this.GridErrorProxy.addError(params.data, field, headerName, '不能为空');
                api.scope.$apply();
            }
            else {
                // TODO: 优化，某些确定不会存在的情况，无需remove
                this.GridErrorProxy.removeError(params.data, field);
                api.scope.$apply();
            }
            api.refreshView();
        };
        return GridValidation;
    })();
    ABGrid.GridValidation = GridValidation;
})(ABGrid || (ABGrid = {}));
