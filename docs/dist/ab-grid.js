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
            //public scope: any = {};
            this.template = '<div class="panel-heading-toolbox" role="toolbar" aria-label="...">' +
                '<div class="btn-group btn-group-sm" role="group" aria-label="..." ng-transclude>' +
                '</div>' +
                '<div class="btn-group btn-group-sm" dropdown keyboard-nav>' +
                '<button id="simple-btn-keyboard-nav" type="button" class="btn btn-darkslategrey btn-clear" dropdown-toggle>' +
                'settings <span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu" role="menu" aria-labelledby="simple-btn-keyboard-nav">' +
                '<li role="menuitem" ng-mouseover="showColumns = true" ng-mouseleave="showColumns = false">' +
                '<a href="#">Columns</a>' +
                '<ul class="sencond-list" ng-show="showColumns">' +
                '<li ng-repeat="col in $parent.options.columnDefs">' +
                '{{col.headerName}}' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="menuitem"><a href="#">Another</a></li>' +
                '<li role="menuitem"><a href="#">Something</a></li>' +
                '<li class="divider"></li>' +
                '<li role="menuitem"><a href="#">Separated</a></li>' +
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyaWRTdGF0dXMudHMiLCJwc1V0aWxzLnRzIiwiZ3JpZFNlcnZpY2UudHMiLCJhYkdyaWQudHMiLCJncmlkVmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6WyJBQkdyaWQiLCJBQkdyaWQuR3JpZFN0YXR1cyIsIkFCR3JpZC5HcmlkU3RhdHVzLmNvbnN0cnVjdG9yIiwiQUJHcmlkLkdyaWRTdGF0dXMud2hlblJvd0FkZGVkIiwiQUJHcmlkLkdyaWRTdGF0dXMud2hlblJvd3NSZW1vdmVkIiwiQUJHcmlkLkdyaWRTdGF0dXMud2hlbkVkaXRlZCIsIkFCR3JpZC5HcmlkU3RhdHVzLmRpcnR5Q2VsbCIsIkFCR3JpZC5HcmlkU3RhdHVzLmlzRGlydHlDZWxsIiwiQUJHcmlkLlBzVXRpbHMiLCJBQkdyaWQuUHNVdGlscy5jb25zdHJ1Y3RvciIsIkFCR3JpZC5Qc1V0aWxzLmluaXRpYWxpemUiLCJBQkdyaWQuR3JpZFNlcnZpY2UiLCJBQkdyaWQuR3JpZFNlcnZpY2UuY29uc3RydWN0b3IiLCJBQkdyaWQuR3JpZFNlcnZpY2Uuc2VsZWN0RWRpdG9yIiwiQUJHcmlkLkdyaWRTZXJ2aWNlLnJlc2l6ZUdyaWQiLCJBQkdyaWQuQUJHcmlkRGlyZWN0aXZlIiwiQUJHcmlkLkFCR3JpZERpcmVjdGl2ZS5jb25zdHJ1Y3RvciIsIkFCR3JpZC5BQkdyaWRUdGlsZSIsIkFCR3JpZC5BQkdyaWRUdGlsZS5jb25zdHJ1Y3RvciIsIkFCR3JpZC5BQkdyaWRUb29sYm94IiwiQUJHcmlkLkFCR3JpZFRvb2xib3guY29uc3RydWN0b3IiLCJBQkdyaWQuQUJHcmlkVG9vbGJveEJ0biIsIkFCR3JpZC5BQkdyaWRUb29sYm94QnRuLmNvbnN0cnVjdG9yIiwiQUJHcmlkLkFCR3JpZFRvb2xib3hEZWxpbWl0ZXIiLCJBQkdyaWQuQUJHcmlkVG9vbGJveERlbGltaXRlci5jb25zdHJ1Y3RvciIsIkFCR3JpZC5BQkdyaWRTZWFyY2giLCJBQkdyaWQuQUJHcmlkU2VhcmNoLmNvbnN0cnVjdG9yIiwiQUJHcmlkLkFCR3JpZEN0cmwiLCJBQkdyaWQuQUJHcmlkQ3RybC5jb25zdHJ1Y3RvciIsIkFCR3JpZC5HcmlkVmFsaWRhdGlvbiIsIkFCR3JpZC5HcmlkVmFsaWRhdGlvbi5jb25zdHJ1Y3RvciIsIkFCR3JpZC5HcmlkVmFsaWRhdGlvbi5jb21wYXJlVmFsdWUiLCJBQkdyaWQuR3JpZFZhbGlkYXRpb24ubm90TnVsbFZhbGlkYXRpb24iXSwibWFwcGluZ3MiOiJBQUFBLDBEQUEwRDtBQUMxRCxxREFBcUQ7QUFFckQsSUFBTyxNQUFNLENBbURaO0FBbkRELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFVWEE7UUFNSUM7WUFIQUMsWUFBT0EsR0FBZUEsRUFBRUEsQ0FBQ0E7WUFDekJBLGVBQVVBLEdBQWVBLEVBQUVBLENBQUNBO1FBRVpBLENBQUNBO1FBRWpCRCxpQ0FBWUEsR0FBWkEsVUFBYUEsSUFBU0E7WUFDbEJFLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1lBQ3BCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUN0QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDNUJBLENBQUNBO1FBRURGLG9DQUFlQSxHQUFmQSxVQUFnQkEsSUFBU0E7WUFDckJHLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLFVBQVNBLEdBQUdBO2dCQUNqQyxNQUFNLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQztZQUN0QixDQUFDLENBQUNBLENBQUNBO1lBQ0hBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLFVBQVNBLElBQUlBO2dCQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7WUFDNUIsQ0FBQyxDQUFDQSxDQUFDQTtZQUVIQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFN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QSxDQUFDQTtnQkFDakJBLEFBQ0FBLDBCQUQwQkE7Z0JBQzFCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxFQUFFQSxVQUFVQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDckVBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQ25CQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUkEsQUFDQUEsZ0NBRGdDQTtnQkFDaENBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUNwREEsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFDbkJBLENBQUNBO1lBRURBLEdBQUdBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3RCQSxDQUFDQTtRQUNMSCxxQkFBQ0E7SUFBREEsQ0F2RUE3QixBQXVFQzZCLElBQUE3QjtJQXZFWUEscUJBQWNBLGlCQXVFMUJBLENBQUFBO0FBQ0xBLENBQUNBLEVBL0VNLE1BQU0sS0FBTixNQUFNLFFBK0VaIiwiZmlsZSI6ImFiLWdyaWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9hbmd1bGFyanMvYW5ndWxhci5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2xvZGFzaC9sb2Rhc2guZC50c1wiLz5cblxubW9kdWxlIEFCR3JpZCB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElHcmlkU3RhdHVzIHtcbiAgICAgICAgd2hlblJvd0FkZGVkKGRhdGE6IGFueSk6IHZvaWQ7XG4gICAgICAgIHdoZW5Sb3dzUmVtb3ZlZChkYXRhOiBhbnkpOiB2b2lkO1xuICAgICAgICB3aGVuRWRpdGVkKCk6IHZvaWQ7XG4gICAgICAgIGRpcnR5Q2VsbChjb2xEZWY6IGFueSwgZGF0YTogYW55KTogdm9pZDtcbiAgICAgICAgaXNEaXJ0eUNlbGwoY29sRGVmOiBhbnksIGRhdGE6IGFueSk6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEdyaWRTdGF0dXMgaW1wbGVtZW50cyBJR3JpZFN0YXR1cyB7XG4gICAgICAgIGlzRGlydHk6IGJvb2xlYW47XG4gICAgICAgIGhhc05ld1JvdzogYm9vbGVhbjtcbiAgICAgICAgbmV3Um93czogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICBkaXJ0eUNlbGxzOiBBcnJheTxhbnk+ID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgICAgICB3aGVuUm93QWRkZWQoZGF0YTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5oYXNOZXdSb3cgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5uZXdSb3dzLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGVuUm93c1JlbW92ZWQoZGF0YTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBfLnJlbW92ZSh0aGlzLm5ld1Jvd3MsIGZ1bmN0aW9uKHJvdykge1xuICAgICAgICAgICAgICByZXR1cm4gcm93ID09PSBkYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfLnJlbW92ZSh0aGlzLmRpcnR5Q2VsbHMsIGZ1bmN0aW9uKGNlbGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNlbGwuZGF0YSA9PT0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5uZXdSb3dzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgdGhpcy5oYXNOZXdSb3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdoZW5FZGl0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlydHlDZWxsKGNvbERlZjogYW55LCBkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHlDZWxscy5wdXNoKHtjb2xEZWY6IGNvbERlZiwgZGF0YTogZGF0YX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNEaXJ0eUNlbGwoY29sRGVmOiBhbnksIGRhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gXy5maW5kSW5kZXgodGhpcy5kaXJ0eUNlbGxzLCB7Y29sRGVmOiBjb2xEZWYsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA+PSAwO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9hbmd1bGFyanMvYW5ndWxhci5kLnRzXCIgLz5cblxubW9kdWxlIEFCR3JpZCB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElQc1V0aWxzIHtcbiAgICAgICAgaW5pdGlhbGl6ZShlbGVtZW50OiBhbnkpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVdpbmRvdyBleHRlbmRzIG5nLklXaW5kb3dTZXJ2aWNlIHtcbiAgICAgICAgUHM6IGFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHNVdGlscyBpbXBsZW1lbnRzIElQc1V0aWxzIHtcbiAgICAgICAgcHJpdmF0ZSBpc1BlcmZlY3Q6IGJvb2xlYW47XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkICR3aW5kb3c6IElXaW5kb3cpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRpYWxpemUoZWxlbWVudDogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1BlcmZlY3QgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICh0aGlzLiR3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNYWMnKSA+PSAwKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNQZXJmZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNQZXJmZWN0KSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cuUHMuaW5pdGlhbGl6ZShlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvYW5ndWxhcmpzL2FuZ3VsYXIuZC50c1wiIC8+XG5cbm1vZHVsZSBBQkdyaWQge1xuXG4gICAgZXhwb3J0IGNsYXNzIEdyaWRTZXJ2aWNlIHtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBjb25zdHJ1Y3RvcjpcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICR0aW1lb3V0XG4gICAgICAgICAqIEBwYXJhbSAkd2luZG93XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJvdGVjdGVkICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlKSB7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxlY3RFZGl0b3Iob3B0aW9uczogYW55KSB7XG5cbiAgICAgICAgICAgIHZhciBlU2VsZWN0ID0gdGhpcy4kd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuXG4gICAgICAgICAgICB2YXIgZW1wdHlPcHRpb24gPSB0aGlzLiR3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBlbXB0eU9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgICAgICAgICAgZW1wdHlPcHRpb24uaW5uZXJIVE1MID0gJy0tIOivt+mAieaLqSAtLSc7XG4gICAgICAgICAgICBlU2VsZWN0LmFwcGVuZENoaWxkKGVtcHR5T3B0aW9uKTtcblxuICAgICAgICAgICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW06IGFueSkge1xuICAgICAgICAgICAgICB2YXIgZU9wdGlvbiA9IHRoaXMuJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgZU9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgaXRlbSk7XG4gICAgICAgICAgICAgIGVPcHRpb24uaW5uZXJIVE1MID0gaXRlbTtcbiAgICAgICAgICAgICAgZVNlbGVjdC5hcHBlbmRDaGlsZChlT3B0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlU2VsZWN0LmNsYXNzTmFtZSA9ICdhZy1jZWxsLWVkaXQtc2VsZWN0JztcblxuICAgICAgICAgICAgcmV0dXJuIGVTZWxlY3Q7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemVHcmlkKGFwaTogYW55LCBleGVjOiBhbnkpIHtcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFwaS5zaXplQ29sdW1uc1RvRml0KCk7XG4gICAgICAgICAgICAgICAgZXhlYygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zaXplQ29sdW1uc1RvRml0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICAgICAgICB9LCAxMClcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9hbmd1bGFyanMvYW5ndWxhci5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJncmlkU3RhdHVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcHNVdGlscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dyaWRTZXJ2aWNlXCIvPlxuXG5tb2R1bGUgQUJHcmlkIHtcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0FCR3JpZCcsIFtdKTtcblxuICAgIGV4cG9ydCBjbGFzcyBBQkdyaWREaXJlY3RpdmUgaW1wbGVtZW50cyBuZy5JRGlyZWN0aXZlIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkICRsb2c6IG5nLklMb2dTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBQc1V0aWxzOiBBQkdyaWQuSVBzVXRpbHMpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZXN0cmljdDogc3RyaW5nID0gXCJFXCI7XG4gICAgICAgIHB1YmxpYyB0cmFuc2NsdWRlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIHJlcGxhY2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGNvbnRyb2xsZXI6IHN0cmluZyA9ICdBQkdyaWRDdHJsJztcbiAgICAgICAgcHVibGljIGNvbnRyb2xsZXJBczogc3RyaW5nID0gJ2dyaWQnO1xuICAgICAgICBwdWJsaWMgc2NvcGU6IGFueSA9IHsgb3B0aW9uczogJz0nLCBzdGF0dXM6ICc9Jywgc2hvd0Zvb3RlcjogJz0nLCBhYlNpemU6ICdAJyB9O1xuICAgICAgICBwdWJsaWMgbGluayA9IChzY29wZTogYW55LCBlbGVtZW50OiBhbnksIGF0dHJzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuJGxvZy5kZWJ1ZygnaW5pdCBwZXJmZWN0IHNjcm9sbGJhcicpO1xuICAgICAgICAgICAgdGhpcy5Qc1V0aWxzLmluaXRpYWxpemUoZWxlbWVudFswXS5maXJzdENoaWxkLnF1ZXJ5U2VsZWN0b3IoJy5hYi1ncmlkIC5hZy1ib2R5LXZpZXdwb3J0JykpO1xuXG4gICAgICAgICAgICBzd2l0Y2goYXR0cnMuYWJTaXplKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc21hbGwnOlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdhYi1zbScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcHVibGljIHRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdCBhYi1ncmlkXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIG5nLXRyYW5zY2x1ZGU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBhZy1ncmlkPVwib3B0aW9uc1wiIGNsYXNzPVwiYWctZnJlc2ggYWctbm9ib3JkZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlciB0ZXh0LWNlbnRlclwiIG5nLXNob3c9XCJzaG93Rm9vdGVyXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQUJHcmlkVHRpbGUgaW1wbGVtZW50cyBuZy5JRGlyZWN0aXZlIHtcbiAgICAgICAgcHVibGljIHJlcXVpcmU6IHN0cmluZyA9ICdeYWJHcmlkJztcbiAgICAgICAgcHVibGljIHJlc3RyaWN0OiBzdHJpbmcgPSAnRSc7XG4gICAgICAgIHB1YmxpYyB0cmFuc2NsdWRlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIHJlcGxhY2U6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgdGVtcGxhdGU6IHN0cmluZyA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nLXRpdGxlXCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBBQkdyaWRUb29sYm94IGltcGxlbWVudHMgbmcuSURpcmVjdGl2ZSB7XG4gICAgICAgIHB1YmxpYyByZXF1aXJlOiBzdHJpbmcgPSAnXmFiR3JpZCc7XG4gICAgICAgIHB1YmxpYyByZXN0cmljdDogc3RyaW5nID0gJ0UnO1xuICAgICAgICBwdWJsaWMgdHJhbnNjbHVkZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIHB1YmxpYyByZXBsYWNlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgLy9wdWJsaWMgc2NvcGU6IGFueSA9IHt9O1xuICAgICAgICBwdWJsaWMgdGVtcGxhdGU6IHN0cmluZyA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nLXRvb2xib3hcIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCIuLi5cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIi4uLlwiIG5nLXRyYW5zY2x1ZGU+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtXCIgZHJvcGRvd24ga2V5Ym9hcmQtbmF2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJzaW1wbGUtYnRuLWtleWJvYXJkLW5hdlwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFya3NsYXRlZ3JleSBidG4tY2xlYXJcIiBkcm9wZG93bi10b2dnbGU+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwic2ltcGxlLWJ0bi1rZXlib2FyZC1uYXZcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGxpIHJvbGU9XCJtZW51aXRlbVwiIG5nLW1vdXNlb3Zlcj1cInNob3dDb2x1bW5zID0gdHJ1ZVwiIG5nLW1vdXNlbGVhdmU9XCJzaG93Q29sdW1ucyA9IGZhbHNlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiPkNvbHVtbnM8L2E+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJzZW5jb25kLWxpc3RcIiBuZy1zaG93PVwic2hvd0NvbHVtbnNcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8bGkgbmctcmVwZWF0PVwiY29sIGluICRwYXJlbnQub3B0aW9ucy5jb2x1bW5EZWZzXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd7e2NvbC5oZWFkZXJOYW1lfX0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2xpPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC91bD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9saT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGxpIHJvbGU9XCJtZW51aXRlbVwiPjxhIGhyZWY9XCIjXCI+QW5vdGhlcjwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8bGkgcm9sZT1cIm1lbnVpdGVtXCI+PGEgaHJlZj1cIiNcIj5Tb21ldGhpbmc8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxsaSByb2xlPVwibWVudWl0ZW1cIj48YSBocmVmPVwiI1wiPlNlcGFyYXRlZDwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdWw+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQUJHcmlkVG9vbGJveEJ0biBpbXBsZW1lbnRzIG5nLklEaXJlY3RpdmUge1xuICAgICAgICBwdWJsaWMgcmVxdWlyZTogc3RyaW5nID0gJ15hYkdyaWRUb29sYm94JztcbiAgICAgICAgcHVibGljIHJlc3RyaWN0OiBzdHJpbmcgPSAnRSc7XG4gICAgICAgIHB1YmxpYyB0cmFuc2NsdWRlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIHJlcGxhY2U6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgc2NvcGU6IGFueSA9IHsgY2xpY2tGdW46ICcmYnRuQ2xpY2snIH07XG4gICAgICAgIHB1YmxpYyB0ZW1wbGF0ZTogc3RyaW5nID1cbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhcmtzbGF0ZWdyZXkgYnRuLWNsZWFyXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICduZy1jbGljaz1cImNsaWNrRnVuKClcIiBuZy10cmFuc2NsdWRlPicgK1xuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBBQkdyaWRUb29sYm94RGVsaW1pdGVyIGltcGxlbWVudHMgbmcuSURpcmVjdGl2ZSB7XG4gICAgICAgIHB1YmxpYyByZXF1aXJlOiBzdHJpbmcgPSAnXmFiR3JpZFRvb2xib3gnO1xuICAgICAgICBwdWJsaWMgcmVzdHJpY3Q6IHN0cmluZyA9ICdFJztcbiAgICAgICAgcHVibGljIHRyYW5zY2x1ZGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgcmVwbGFjZTogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIHB1YmxpYyB0ZW1wbGF0ZTogc3RyaW5nID1cbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0b29sYm94LWRlbGltaXRlclwiPjwvc3Bhbj4nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBBQkdyaWRTZWFyY2ggaW1wbGVtZW50cyBuZy5JRGlyZWN0aXZlIHtcbiAgICAgICAgcHVibGljIHJlcXVpcmU6IHN0cmluZyA9ICdeYWJHcmlkJztcbiAgICAgICAgcHVibGljIHJlc3RyaWN0OiBzdHJpbmcgPSAnRSc7XG4gICAgICAgIHB1YmxpYyByZXBsYWNlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIGNvbnRyb2xsZXIgPSAoJHNjb3BlOiBhbnksICRsb2c6IGFueSkgPT4ge1xuICAgICAgICAgICAgJGxvZy5kZWJ1Zygkc2NvcGUuJHBhcmVudC5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHVibGljIHRlbXBsYXRlOiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgICc8Zm9ybSBjbGFzcz1cImZvcm0taW5saW5lIHB1bGwtcmlnaHRcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNzbSBoYXMtZmVlZGJhY2tcIiBpZD1cImF0dHItc2VhcmNoXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIHNyLW9ubHlcIiBmb3I9XCJiYXNlRmlsdGVyVGV4dFwiPkhpZGRlbiBsYWJlbDwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmctbW9kZWw9XCIkcGFyZW50Lm9wdGlvbnMucXVpY2tGaWx0ZXJUZXh0XCIgdHlwZT1cInNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJiYXNlRmlsdGVyVGV4dFwiIGFyaWEtZGVzY3JpYmVkYnk9XCJzZW5zb3JGaWx0ZXJUZXh0U3RhdHVzXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoIGZvcm0tY29udHJvbC1mZWVkYmFja1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGlkPVwic2Vuc29yRmlsdGVyVGV4dFN0YXR1c1wiIGNsYXNzPVwic3Itb25seVwiPihzdWNjZXNzKTwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9mb3JtPic7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tZXJTZWFyY2hTY29wZSAgZXh0ZW5kcyBuZy5JU2NvcGUge1xuICAgICAgICBvcHRpb25zOiBhbnk7XG4gICAgICAgIEN0cmw6IEFCR3JpZEN0cmw7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEFCR3JpZEN0cmwge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgJHNjb3BlOiBBQkdyaWQuSUN1c3RvbWVyU2VhcmNoU2NvcGUsXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIEdyaWRTdGF0dXM6IHR5cGVvZiBBQkdyaWQuR3JpZFN0YXR1cyxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1czogYW55ID0gbmV3IHRoaXMuR3JpZFN0YXR1cygpO1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMuYXBpLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwLmNvbnRyb2xsZXIoJ0FCR3JpZEN0cmwnLCAgWyckc2NvcGUnLCAnR3JpZFN0YXR1cycsICckdGltZW91dCcsIEFCR3JpZC5BQkdyaWRDdHJsXSk7XG4gICAgYXBwLmZhY3RvcnkoJ1BzVXRpbHMnLCBbJyR3aW5kb3cnLCAoJHdpbmRvdzogQUJHcmlkLklXaW5kb3cpID0+IG5ldyBBQkdyaWQuUHNVdGlscygkd2luZG93KV0pO1xuICAgIGFwcC5mYWN0b3J5KCdHcmlkU3RhdHVzJywgWygpID0+IEFCR3JpZC5HcmlkU3RhdHVzXSk7XG4gICAgYXBwLmZhY3RvcnkoJ0FCR3JpZCcsIFsnJHRpbWVvdXQnLCAnJHdpbmRvdycsICgkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLCAkd2luZG93OiBuZy5JV2luZG93U2VydmljZSkgPT4gbmV3IEFCR3JpZC5HcmlkU2VydmljZSgkdGltZW91dCwgJHdpbmRvdyldKTtcbiAgICBhcHAuZGlyZWN0aXZlKFwiYWJHcmlkXCIsIFsnJGxvZycsICdQc1V0aWxzJywgKCRsb2c6IG5nLklMb2dTZXJ2aWNlLCBQc1V0aWxzOiBBQkdyaWQuUHNVdGlscykgPT4gbmV3IEFCR3JpZC5BQkdyaWREaXJlY3RpdmUoJGxvZywgUHNVdGlscyldKTtcbiAgICBhcHAuZGlyZWN0aXZlKFwiYWJHcmlkVGl0bGVcIiwgWygpID0+IG5ldyBBQkdyaWQuQUJHcmlkVHRpbGUoKV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoXCJhYkdyaWRUb29sYm94XCIsIFsoKSA9PiBuZXcgQUJHcmlkLkFCR3JpZFRvb2xib3goKV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoXCJhYkdyaWRUb29sYm94QnRuXCIsIFsoKSA9PiBuZXcgQUJHcmlkLkFCR3JpZFRvb2xib3hCdG4oKV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoXCJhYkdyaWRUb29sYm94RGVsaW1pdGVyXCIsIFsoKSA9PiBuZXcgQUJHcmlkLkFCR3JpZFRvb2xib3hEZWxpbWl0ZXIoKV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoXCJhYkdyaWRTZWFyY2hcIiwgWygpID0+IG5ldyBBQkdyaWQuQUJHcmlkU2VhcmNoKCldKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2FuZ3VsYXJqcy9hbmd1bGFyLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbG9kYXNoL2xvZGFzaC5kLnRzXCIvPlxuXG5tb2R1bGUgQUJHcmlkIHtcblxuICAgIGludGVyZmFjZSBJR3JpZFZhbGlkYXRpb24ge1xuICAgICAgICBjb21wYXJlVmFsdWUob2xkVmFsdWU6IGFueSwgbmV3VmFsdWU6IGFueSwgdmFsaWRhdG9yOiBhbnkpOiB2b2lkO1xuICAgICAgICBub3ROdWxsVmFsaWRhdGlvbihwYXJhbXM6IGFueSk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEdyaWRWYWxpZGF0aW9uIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkICRsb2c6IG5nLklMb2dTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBfOiBfLkxvRGFzaFN0YXRpYyxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgR3JpZEVycm9yUHJveHk6IGFueSkge1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRoaXMgaXMgbm90IGEgZ29vZCBmdW5jdGlvbiwgaXQncyBhIHJlbWluZGVyO1xuICAgICAgICAgKi9cbiAgICAgICAgY29tcGFyZVZhbHVlKG9sZFZhbHVlOiBhbnksIG5ld1ZhbHVlOiBhbnksIHZhbGlkYXRvcjogYW55KTogdm9pZCB7XG4gICAgICAgICAgICAvLyB2YXIgb2xkSW52YWxpZCA9IHZhbGlkYXRvcihvbGRWYWx1ZSk7XG4gICAgICAgICAgICAvLyB2YXIgbmV3SW52YWxpZCA9IHZhbGlkYXRvcihuZXdWYWx1ZSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gdmFyIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpZiAoIW9sZEludmFsaWQgJiYgIW5ld0ludmFsaWQgJiYgb2xkVmFsdWUgPT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gJ3ZhbHVlcyBkbyBub3QgY2hhbmdlZCEnO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmIChvbGRJbnZhbGlkICYmICghbm9kZS5lcnJvcnMgfHwgIW5vZGUuZXJyb3JzW2ZpZWxkXSkpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpZiAobmV3SW52YWxpZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmICghb2xkSW52YWxpZCAmJiAhbmV3SW52YWxpZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgTG9nLndyaXRlKCd2YWx1ZXMga2VlcHMgdmFsaWQhJyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChvbGRJbnZhbGlkICYmIG5ld0ludmFsaWQpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIExvZy53cml0ZSgndmFsdWVzIGtlZXBzIGludmFsaWQhJyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChvbGRJbnZhbGlkICYmICFuZXdJbnZhbGlkKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICBhcGkucmVtb3ZlRXJyb3Iobm9kZSwgcGFyYW1zLmNvbERlZik7XG4gICAgICAgICAgICAvLyAgIExvZy53cml0ZSgndmFsdWVzIGlzIHZhbGlkIScpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoIW9sZEludmFsaWQgJiYgbmV3SW52YWxpZCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgYXBpLmFkZEVycm9yKG5vZGUsIHBhcmFtcy5jb2xEZWYsICfkuI3og73kuLrnqbrvvIEnKTtcbiAgICAgICAgICAgIC8vICAgTG9nLndyaXRlKCd2YWx1ZXMgaXMgaW52YWxpZCEnKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cblxuICAgICAgICBub3ROdWxsVmFsaWRhdGlvbihwYXJhbXM6IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gcGFyYW1zLmNvbERlZi5maWVsZDtcbiAgICAgICAgICAgIHZhciBoZWFkZXJOYW1lID0gcGFyYW1zLmNvbERlZi5oZWFkZXJOYW1lO1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gcGFyYW1zLm5ld1ZhbHVlO1xuICAgICAgICAgICAgdmFyIG5ld0ludmFsaWQgPSBfLmlzRW1wdHkobmV3VmFsdWUpO1xuICAgICAgICAgICAgdmFyIGFwaSA9IHBhcmFtcy5hcGk7XG5cbiAgICAgICAgICAgIGFwaS5zdGF0dXMuZGlydHlDZWxsKHBhcmFtcy5jb2xEZWYsIHBhcmFtcy5kYXRhKTtcblxuICAgICAgICAgICAgaWYgKG5ld0ludmFsaWQpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IOS8mOWMlu+8jOafkOS6m+ehruWumuWtmOWcqOeahOaDheWGte+8jOaXoOmcgOa3u+WKoFxuICAgICAgICAgICAgdGhpcy5HcmlkRXJyb3JQcm94eS5hZGRFcnJvcihwYXJhbXMuZGF0YSwgZmllbGQsIGhlYWRlck5hbWUsICfkuI3og73kuLrnqbonKTtcbiAgICAgICAgICAgIGFwaS5zY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPOiDkvJjljJbvvIzmn5Dkupvnoa7lrprkuI3kvJrlrZjlnKjnmoTmg4XlhrXvvIzml6DpnIByZW1vdmVcbiAgICAgICAgICAgIHRoaXMuR3JpZEVycm9yUHJveHkucmVtb3ZlRXJyb3IocGFyYW1zLmRhdGEsIGZpZWxkKTtcbiAgICAgICAgICAgIGFwaS5zY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBpLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=