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
