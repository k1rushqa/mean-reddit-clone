var app =  angular.module('flapperNew', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello, world!';
  }]);