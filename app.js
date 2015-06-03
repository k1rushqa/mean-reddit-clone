// declare app and dependencies
var app = angular.module('flapperNews', ['ui.router']);

//post-making assembly line
app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;

}]);

//configure ui-router
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    
    //home state
    $stateProvider
      .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });
    
    //posts state
    $stateProvider
      .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });  
    $urlRouterProvider.otherwise('home');
  }]);

// defining main $scope
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
        upvotes: 0,
        comments: [
        {author: 'Joe', body: 'Great post!', upvotes: 2},
        {author: 'Bill', body: 'Bad post!', upvotes: 0},
        ]
      });
      $scope.title = '';
      $scope.link = '';
    };

    // upvote
    $scope.incrementUpvotes = function(post){
      post.upvotes += 1;
    };

  }]);

//defining posts $scope
app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){
  $scope.post = posts.posts[$stateParams.id];
}]);