// declare app and dependencies
var app = angular.module('flapperNews', ['ui.router']);

//post-making assembly line
app.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };
  return o;

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.get = function(id)  {
    return $http.get('/posts/' +id).then(function(res){
      return res.data;
    });
  };

  o.create = function(post) {
    return $http.post('/posts', post, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      post.upvotes += 1;
    });
  };

  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };

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
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })

    //posts state
    $stateProvider
      .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });

    $stateProvider
      .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    $stateProvider
      .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
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

    //add posts
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
    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };

    //save posts to server
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      posts.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.link = '';
    };

    //save comments to server
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.isLoggedIn = auth.isLoggedIn;

  }]);

//defining posts $scope
app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts, post){
    $scope.post = post;

    //add comments
    $scope.addComment = function()  {
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };

    //upvote
    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment);
    };

    $scope.isLoggedIn = auth.isLoggedIn;
  }]);

//user authentication controller
app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
      auth.register($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };

    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };
  }]);

//nav controller
app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }]);

//web auth token factory
app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['flapper-news-token'];
  }

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('flapper-news-token');
  };

  return auth;
}]);