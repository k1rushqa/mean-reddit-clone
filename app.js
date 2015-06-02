var app = angular.module('flapperNews', []);

//post-making assembly line
app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
  
}]);

// defining $scope
app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.test = 'Hello, world!';
    
    //placeholder posts
    $scope.posts = posts.posts;
    

    // function adds posts (title, link, upvotes);
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

    // upvote
    $scope.incrementUpvotes = function(post){
      post.upvotes += 1;
    };

  }]);