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
        GridValidation.prototype.compareValue = function (oldValue, newValue, validator) {
        };
        GridValidation.prototype.notNullValidation = function (params) {
            var field = params.colDef.field;
            var headerName = params.colDef.headerName;
            var newValue = params.newValue;
            var newInvalid = _.isEmpty(newValue);
            var api = params.api;
            api.status.dirtyCell(params.colDef, params.data);
            if (newInvalid) {
                this.GridErrorProxy.addError(params.data, field, headerName, '不能为空');
                api.scope.$apply();
            }
            else {
                this.GridErrorProxy.removeError(params.data, field);
                api.scope.$apply();
            }
            api.refreshView();
        };
        return GridValidation;
    })();
    ABGrid.GridValidation = GridValidation;
})(ABGrid || (ABGrid = {}));
