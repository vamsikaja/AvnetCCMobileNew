/**
*  Loading Overlay Service
*
*  Provides methods for showing and hiding Loading Overlay
*/
(function(){
	angular.module('ccMobile')
	.factory("loadingOverlayService", loadingOverlayService);
	
	function loadingOverlayService(){
		var busyInd = new WL.BusyIndicator ("content", {text: "Loading..."});
		
		var loadingOverlayService = {
				show : show,
				hide : hide
		};
		
		/** Shows Loading Overlay */
		function show(){
			busyInd.show();
		}
		
		/** Hides Loading Overlay */
		function hide(){
			//while(busyInd.isVisible()){
				busyInd.hide();
			//}
		}		
		return loadingOverlayService;
	}
})();