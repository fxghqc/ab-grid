/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts"/>

module ABGrid {

    export interface IGridStatus {
        whenRowAdded(data: any): void;
        whenRowsRemoved(data: any): void;
        whenEdited(): void;
        dirtyCell(colDef: any, data: any): void;
        isDirtyCell(colDef: any, data: any): boolean;
    }

    export class GridStatus implements IGridStatus {
        isDirty: boolean;
        hasNewRow: boolean;
        newRows: Array<any> = [];
        dirtyCells: Array<any> = [];

        constructor() { }

        whenRowAdded(data: any): void {
            this.isDirty = true;
            this.hasNewRow = true;
            this.newRows.push(data);
        }

        whenRowsRemoved(data: any): void {
            _.remove(this.newRows, function(row) {
              return row === data;
            });
            _.remove(this.dirtyCells, function(cell) {
              return cell.data === data;
            });

            if (this.newRows.length < 1) {
              this.hasNewRow = false;
            }
        }

        whenEdited(): void {
            this.isDirty = true;
        }

        dirtyCell(colDef: any, data: any): void {
            this.dirtyCells.push({colDef: colDef, data: data});
        }

        isDirtyCell(colDef: any, data: any): boolean {
            var index = _.findIndex(this.dirtyCells, {colDef: colDef, data: data});
            return index >= 0;
        }

    }
}
