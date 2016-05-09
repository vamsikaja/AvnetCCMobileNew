/** Contains r2o-modal, r2o-modal-toggle and r2o-modal-close directives */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.directive('r2oModal', r2oModal)
	.directive('r2oModalToggle', r2oModalToggle)
	.directive('r2oModalClose',r2oModalClose);
	r2oModal.$inject = ['$rootScope', '$timeout'];

	/**
	 * r2o-modal Directive 
	 * Adds a modal
	 * Attributes:
	 * modal: Required attribute. Should be unique for each modal used 
	 * showViewHeader: if true will show the View's header 
	 * useParentFooter: if true shows parent's footer 
	 * enableTouchClose: if true closes the modal when touched on it 
	 * touch-call-back-method: if enableTouchClose is true, this method is called when touched on the modal
	 */
	function r2oModal($rootScope, $timeout){
		return {
			transclude: true,
			restrict : "E", 
			scope :{
				touchCallBackMethod:'&'
			},
			link : function(scope, element, attrs){
				if(attrs.useparentfooter != undefined && attrs.useparentfooter == "false"){
					//element.css('z-index',9999);
					scope.useParentFooter = 9999; 
				}else{
					element.css('z-index',99);
					scope.useParentFooter = 99;
				}
				if(attrs.enabletouchclose=="true"){
					element[0].ontouchstart=function(){
						scope.touchCallBackMethod();
					}
				}
				
				scope.$on("toggle-"+attrs.modal, function(){
					$timeout(function(){
						scope.$apply(function(scope){
							if(attrs.showviewheader!="true"){
								if($rootScope.modalShown=='increaseZIndex'){
									$rootScope.modalShown=undefined;
									scope.filterActive = undefined;
								}
								else{
									$rootScope.modalShown='increaseZIndex';
									scope.filterActive = "activeButton";
								}
							}
							scope.show = !scope.show;
							if(device.platform=='iOS'){
								$rootScope.showHeaderOverlay= !$rootScope.showHeaderOverlay;
							}
						});	
					});	
				});
				
				scope.$on('close-'+attrs.modal, function(){
					scope.$apply(function(){
						if(scope.show){
							scope.show = false;
							$rootScope.modalShown=undefined;
							scope.filterActive = undefined;
							$rootScope.showHeaderOverlay=false;
						}
					});
				});
			},
			template : "        <div class='r2oModal' style='z-index:{{useParentFooter}};' class='grid-block vertical' ng-show='show'>" + 
					   "            <div class='r2oModalContent' ng-transclude></div>"+
				       "        </div>"
		};
	}
	
	r2oModalClose.$inject = ['$rootScope'];

	/**
	 * r2o-modal-close Directive 
	 * Its an attribute directive. When this directive is used as an attribute to an element, the click on 
	 * the element will close the modal with the modal attribute value same as the value passed to r2o-modal-close attribute
	 */
	function r2oModalClose($rootScope){
		return {
			restrict : "A", 
			link: function(scope, element, attrs)
            {
				var modal = attrs.r2oModalClose;
				element.on('click', function(){
                	$rootScope.$broadcast("close-"+modal);
                });
            }
		};
	}
	
	r2oModalToggle.$inject = ['$rootScope'];

	/**
	 * r2o-modal-toggle Directive 
	 * Its an attribute directive. When this directive is used as an attribute to an element, the click on 
	 * the element will toggle the hide/show of the modal with the modal attribute value same as the value passed to r2o-modal-toggle attribute
	 */
	function r2oModalToggle($rootScope){
		return {
			restrict : "A", 
			link: function(scope, element, attrs)
            {
				var modal = attrs.r2oModalToggle;
				element.on('click', function(){
                	$rootScope.$broadcast("toggle-"+modal);
                });
            }
		};
	}
	
})();