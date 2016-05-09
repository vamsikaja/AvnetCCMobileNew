(function () {

    angular.module('ccMobile').run(run);

    function run($rootScope, CONST, $state, loginFactory) {
        //TODO: establish and then move all these to a main app controller
        
        $rootScope.version = CONST.VERSION;
        $rootScope.busyInd = new WL.BusyIndicator('content', {text: 'Loading...'});
        $rootScope.IsInternal=localStorage.getItem('IsInternal');
        
        $rootScope.goToState = goToState;
        $rootScope.logout = logout;
        
        function goToState(stateName, params){
            console.log('run: goToState: ', stateName, params);
            $state.go('^.'+stateName, params);
        }

        function logout(){
            console.log('run: logout');
            loginFactory.logout();
        }
        
        FastClick.attach(document.body);
    }

})();