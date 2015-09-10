/// <reference path="../typings/angularjs/angular.d.ts" />

module ABGrid {

    export interface IPsUtils {
        initialize(element: any): void;
    }

    export interface IWindow extends ng.IWindowService {
        Ps: any;
    }

    export class PsUtils implements IPsUtils {
        private isPerfect: boolean;

        constructor(protected $window: IWindow) {
        }

        initialize(element: any): void {
            if (this.isPerfect === undefined &&
                (this.$window.navigator.userAgent.indexOf('Mac') >= 0)) {
                this.isPerfect = true;
            }

            if (this.isPerfect) { return; }

            this.$window.Ps.initialize(element);
        }

    }
}
