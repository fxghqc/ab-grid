/// <reference path="../typings/angularjs/angular.d.ts" />
var ABGrid;
(function (ABGrid) {
    var GridService = (function () {
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
