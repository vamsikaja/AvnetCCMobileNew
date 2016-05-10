
/* JavaScript content from app/shared/controllers/homeController.js in folder common */
/**
 * @name homeController
 * @desc Home controller
 */
(function() {
  'use strict';
  angular.module('ccMobile')
    .controller('homeController', homeController);

  function homeController($scope, $rootScope, userService, CONST) {
    console.log('homeController: load');
    
    // bindable variables
    $scope.permissions = userService.userData.permissions;
    $scope.tools = CONST.TOOLS;

    // internals

    function activate() {    	
      console.log('homeController: activate');
      $rootScope.busyInd.hide();
    }

    activate();
}

})();
