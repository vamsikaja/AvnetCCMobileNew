
/* JavaScript content from app/modules/requests/directives/r2oCheckBox.js in folder common */
/**
 * r2o-check-box Directive 
 * It adds styled checkbox
 */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")		
		.directive('r2oCheckBox', r2oCheckBox);
	
	function r2oCheckBox(){
		return {
			transclude: true,
			restrict : "E",
			scope:{
				isSelected : "="
			},
			link : function(scope, element, attrs){
				scope.toggle = toggle;
				if(attrs.checkBoxSide == 'right'){
					scope.checkBoxSide = "right";
				}else{
					
				}
				function toggle(){
						if(scope.isSelected == undefined || scope.isSelected == null){
							console.log("toggling to true");
							scope.isSelected = true;
						}else{
							console.log("toggling");
							scope.isSelected = !scope.isSelected;
						}
				}
			},
			template :  '<div ng-click="toggle()" class="checkBoxWrapper {{isSelected ? \'selected\' : \'\'}}">'+
							'<div ng-hide="checkBoxSide" class="checkBox">'+
								'<i class="icon-checkmark"></i>'+
							'</div>'+
							'<div class="checkBoxContent" style="text-align:{{checkBoxSide}}" ng-transclude></div>'+
							'<div ng-show="checkBoxSide" ng-show="" class="checkBox">'+
								'<i class="icon-checkmark"></i>'+
							'</div>'+
						'</div>'
		};
	}
})();