/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts"/>

module ABGrid {

    interface IGridValidation {
        compareValue(oldValue: any, newValue: any, validator: any): void;
        notNullValidation(params: any): void;
    }

    export class GridValidation {
        constructor(protected $log: ng.ILogService,
                protected _: _.LoDashStatic,
                protected GridErrorProxy: any) {
        }

        /**
         * this is not a good function, it's a reminder;
         */
        compareValue(oldValue: any, newValue: any, validator: any): void {
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
        }

        notNullValidation(params: any): void {
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
            } else {
            // TODO: 优化，某些确定不会存在的情况，无需remove
            this.GridErrorProxy.removeError(params.data, field);
            api.scope.$apply();
            }

            api.refreshView();
        }
    }
}
