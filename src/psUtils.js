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
