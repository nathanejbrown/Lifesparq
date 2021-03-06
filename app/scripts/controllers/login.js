'use strict';

angular.module('lifesparqApp')
.controller('loginCtrl', function ($scope, $mdDialog, $http, $location, $localStorage, $cookies) {
  $scope.showSingleUserSignup = function(ev) {
    $mdDialog.show({
      controller: userController,
      templateUrl: 'signupFormSingle.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
  $scope.showTeamSignup = function(ev) {
    $mdDialog.show({
      controller: userController,
      templateUrl: 'signupFormTeam.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }
  $scope.showMemberLogin = function (ev) {
    $mdDialog.show({
      controller: userController,
      templateUrl: 'memberLogin.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    })
    // ModalService.showMemberLogin(ev);
  }

  $localStorage.$reset();

  $scope.user = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: ''
  };

  $scope.error = '';

  function userController($scope, $mdDialog) {

    $scope.hide = () => {
      $mdDialog.hide();
    }

    $scope.cancel = () => {
      $mdDialog.cancel();
    }

    $scope.answer = (answer) => {
      $mdDialog.hide(answer);
    }

    $scope.loginUser = function() {
      $http({
        url: 'https://stormy-springs-94108.herokuapp.com/compare',
        method: 'POST',
        data: {
          emailAddress: $scope.user.emailAddress,
          password: $scope.user.password
        }
      }).then(response => {
        if (response.data) {
          var date = new Date();
          date.setTime(date.getTime()+((60*1000)*120));
          $cookies.put('Authorization', response.data.token, {'expires': date});
          $mdDialog.hide();
          $location.path('/profile');
        }
      })
    }

    $scope.submitUser = function() {
      $localStorage.firstName = $scope.user.firstName;
      $localStorage.lastName = $scope.user.lastName;
      $localStorage.emailAddress = $scope.user.emailAddress;
      $mdDialog.hide();
      $location.path('/moreinfosingle');
    }

    $scope.submitCoach = function() {
      $localStorage.firstName = $scope.user.firstName;
      $localStorage.lastName = $scope.user.lastName;
      $localStorage.emailAddress = $scope.user.emailAddress;
      $mdDialog.hide();
      $location.path('/moreinfocoach');
    }

  }
});
