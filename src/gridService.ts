/// <reference path="../typings/angularjs/angular.d.ts" />

module ABGrid {

    export class GridService {

        /*
         * constructor:
         *
         * @param $timeout
         * @param $window
         */
        constructor (protected $timeout: ng.ITimeoutService,
                protected $window: ng.IWindowService) {
        }

        selectEditor(options: any) {

            var eSelect = this.$window.document.createElement('select');

            var emptyOption = this.$window.document.createElement('option');
            emptyOption.setAttribute('value', '');
            emptyOption.innerHTML = '-- 请选择 --';
            eSelect.appendChild(emptyOption);

            options.forEach(function(item: any) {
              var eOption = this.$window.document.createElement('option');
              eOption.setAttribute('value', item);
              eOption.innerHTML = item;
              eSelect.appendChild(eOption);
            });

            eSelect.className = 'ag-cell-edit-select';

            return eSelect;
        }

        resizeGrid(api: any, exec: any) {
            this.$timeout(() => {
                api.sizeColumnsToFit();
                exec();

                this.$timeout(() => {
                    api.sizeColumnsToFit();
                    exec();
                }, 10)
            });


        }

    }

}
