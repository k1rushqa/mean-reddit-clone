var app =  angular.module('flapperNew', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello, world!';
  }]);

$scope.posts = [
  {title: 'post1', upvotes: 9 },
  {title: 'post2', upvotes: 2 },
  {title: 'post3', upvotes: 12 },
  {title: 'post4', upvotes: 5 },
  {title: 'post5', upvotes: 4 },
];

