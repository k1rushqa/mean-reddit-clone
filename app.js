var app = angular.module('flapperNews', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello, world!';

    $scope.posts = [
      {title: 'post1', upvotes: 9 },
      {title: 'post2', upvotes: 2 },
      {title: 'post3', upvotes: 12 },
      {title: 'post4', upvotes: 5 },
      {title: 'post5', upvotes: 4 }
    ];

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0
      });
      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post){
      post.upvotes += 1;
    };

  }]);