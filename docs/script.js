'use strict';

var app = angular.module('abGridExample', ['angularGrid', 'ABGrid']);

app.controller('MainCtrl', ['$scope', function($scope) {
  var i, cols = 100, rows = 100;

  var columnDefs = [
      {headerName: 'Order', field: 'order', cellRenderer: function(params) {
         return params.node.id + 1;
       }, width: 50
      },
      {headerName: "Make", field: "make"},
      {headerName: "Model", field: "model"},
      {headerName: "Price", field: "price"}
  ];

  for (i = 0; i < cols; i++) {
    columnDefs.push({
      headerName: 'Price' + i,
      field: 'price' + i
    });
  }

  var rowData = [
      {make: "Toyota", model: "Celica", price: 35000},
      {make: "Ford", model: "Mondeo", price: 32000},
      {make: "Porsche", model: "Boxter", price: 72000}
  ];

  for (i = 0; i < rows; i++) {
    rowData.push({make: "Porsche", model: "Boxter", price: 72000});
  }

  rowData.forEach(function(row) {
    for (i = 0; i < cols; i++) {
      row['price' + i] = 35000;
    }
  });

  $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      rowBuffer: 203     // use rowsBuffer when cols number is very large;
  };

}]);
