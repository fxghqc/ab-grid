/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />
declare module ABGrid {
    interface IGridStatus {
        whenRowAdded(data: any): void;
        whenRowsRemoved(data: any): void;
        whenEdited(): void;
        dirtyCell(colDef: any, data: any): void;
        isDirtyCell(colDef: any, data: any): boolean;
    }
    class GridStatus implements IGridStatus {
        isDirty: boolean;
        hasNewRow: boolean;
        newRows: Array<any>;
        dirtyCells: Array<any>;
        constructor();
        whenRowAdded(data: any): void;
        whenRowsRemoved(data: any): void;
        whenEdited(): void;
        dirtyCell(colDef: any, data: any): void;
        isDirtyCell(colDef: any, data: any): boolean;
    }
}
declare module ABGrid {
    interface IPsUtils {
        initialize(element: any): void;
    }
    interface IWindow extends ng.IWindowService {
        Ps: any;
    }
    class PsUtils implements IPsUtils {
        protected $window: IWindow;
        private isPerfect;
        constructor($window: IWindow);
        initialize(element: any): void;
    }
}
declare module ABGrid {
    class GridService {
        protected $timeout: ng.ITimeoutService;
        protected $window: ng.IWindowService;
        constructor($timeout: ng.ITimeoutService, $window: ng.IWindowService);
        selectEditor(options: any): HTMLSelectElement;
        resizeGrid(api: any, exec: any): void;
    }
}
declare module ABGrid {
    class ABGridDirective implements ng.IDirective {
        protected $log: ng.ILogService;
        protected PsUtils: ABGrid.IPsUtils;
        constructor($log: ng.ILogService, PsUtils: ABGrid.IPsUtils);
        restrict: string;
        transclude: boolean;
        replace: boolean;
        controller: string;
        controllerAs: string;
        scope: any;
        link: (scope: any, element: any) => void;
        template: string;
    }
    class ABGridTtile implements ng.IDirective {
        require: string;
        restrict: string;
        transclude: boolean;
        replace: boolean;
        template: string;
    }
    class ABGridToolbox implements ng.IDirective {
        require: string;
        restrict: string;
        transclude: boolean;
        replace: boolean;
        template: string;
    }
    class ABGridToolboxBtn implements ng.IDirective {
        require: string;
        restrict: string;
        transclude: boolean;
        replace: boolean;
        scope: any;
        template: string;
    }
    class ABGridToolboxDelimiter implements ng.IDirective {
        require: string;
        restrict: string;
        transclude: boolean;
        replace: boolean;
        template: string;
    }
    class ABGridSearch implements ng.IDirective {
        require: string;
        restrict: string;
        replace: boolean;
        controller: ($scope: any, $log: any) => void;
        template: string;
    }
    interface ICustomerSearchScope extends ng.IScope {
        options: any;
        Ctrl: ABGridCtrl;
    }
    class ABGridCtrl {
        protected $scope: ABGrid.ICustomerSearchScope;
        protected GridStatus: ABGrid.IGridStatus;
        protected $timeout: ng.ITimeoutService;
        constructor($scope: ABGrid.ICustomerSearchScope, GridStatus: ABGrid.IGridStatus, $timeout: ng.ITimeoutService);
    }
}
declare module ABGrid {
    class GridValidation {
        protected $log: ng.ILogService;
        protected _: _.LoDashStatic;
        protected GridErrorProxy: any;
        constructor($log: ng.ILogService, _: _.LoDashStatic, GridErrorProxy: any);
        /**
         * this is not a good function, it's a reminder;
         */
        compareValue(oldValue: any, newValue: any, validator: any): void;
        notNullValidation(params: any): void;
    }
}
