'use strict';

angular.module('lifesparqApp')
  .controller('signUpUserCtrl', function ($scope, $log, $localStorage, $http, $cookies) {

    $scope.firstName = $localStorage.firstName || '';
    $scope.lastName = $localStorage.lastName || '';
    $scope.emailAddress = $localStorage.emailAddress || '';

    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

    $scope.user = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      emailAddress: $scope.emailAddress,
      password: '',
      sport: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      skillLevel: ''
    }

    $scope.profileImage = '../../images/nathan.jpg';

    $scope.secondPassword = '';

    $scope.passwordError = '';

    $scope.getEmail = function () {
      // console.log('anything');
      $http({
        url: 'http://localhost:3000/moretests',
        method: 'GET'
      }).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      })
    }

    $scope.getEmail();

    $scope.showPhotoEditor = function () {
      const files = document.getElementById('picture-input').files;
      const file = files[0];

      $scope.profileImage = file.name;
    }

    $scope.validatePasswords = function () {
      var firstPassword = $scope.user.password;
      var secondPassword = $scope.secondPassword;

      if (firstPassword.length && secondPassword.length) {
        if (firstPassword !== secondPassword) {
          $scope.passwordError = 'Passwords must match';
        } else {
          $scope.passwordError = '';
        }
      }
    }

    $scope.submitUser = function(profilePicture) {
      $localStorage.$reset();

      $http({
        url: 'https://stormy-springs-94108.herokuapp.com/newuser',
        method: 'POST',
        data: {
          tableName: 'users',
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          password: $scope.user.password,
          emailAddress: $scope.user.emailAddress,
          sport: $scope.user.sport,
          profilePicture: profilePicture || ''
        }
      }).then(response => {
        console.log(response);
      })
    }

    $scope.saveImage = function () {
      const files = document.getElementById('picture-input').files;
      const file = files[0];
      if(!file) {
        $scope.submitUser();
        return;
      }
      $scope.getSignedRequest(file);
    }

    $scope.getSignedRequest = function (file) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://stormy-springs-94108.herokuapp.com/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            $scope.uploadFile(file, response.signedRequest, response.url);
            $scope.submitUser(response.url);
          }
          else {
            alert('Could not get signed URL.');
          }
        }
      };
      xhr.send();
    }

    $scope.uploadFile = function (file, signedRequest, url) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            document.getElementById('preview').src = url;
            document.getElementById('avatar-url').value = url;
          }
          else {
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }


  });
