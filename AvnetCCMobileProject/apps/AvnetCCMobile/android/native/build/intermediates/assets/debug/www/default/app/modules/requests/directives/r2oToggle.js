
/* JavaScript content from app/modules/requests/directives/r2oToggle.js in folder common */
/**
 * r2o-toggle Directive 
 * Adds Styled Toggle Button
 * Also adds the click to toggle and SwipeRight/SwipeLeft to Enable/Disable functionality
 */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")		
		.directive('r2oToggle', r2oToggle);
	
	function r2oToggle(){
		return {
			restrict:'E',
			translude : true,
			scope : {
				isChecked : "="
			},
            link:function(scope,element, attrs){
            	var prevX,currX;
            	var touchStartTime,touchEndTime;
            	function touchstartCallback(event){
            		console.log('in touchstartCallback');
            		event.preventDefault();
            		prevX=event.changedTouches[0].clientX;
            		touchStartTime=Date.now();
            		//console.log('prevX :'+prevX);
            	}

            	function touchmoveCallback(event){
            		console.log('in touchmoveCallback');
					event.preventDefault();
				}

				function touchendCallback(){
					console.log('in touchendCallback');
					touchEndTime=Date.now();
					currX=event.changedTouches[0].clientX;
					console.log('currX-prevX :'+currX-prevX);
					console.log('currX :'+currX);
					if(currX-prevX > 40 || currX-prevX < -40){
						if(currX-prevX>40){
							console.log('swiped right');
							scope.isChecked=true;
						}
						else if(currX-prevX<-40){
							console.log('swiped left');
							scope.isChecked=false;
						}
					}
					else{
						if(touchEndTime - touchStartTime <=150){
							console.log('toggle clikced');
							scope.isChecked=!scope.isChecked;
						}
					}
					scope.$apply();
				}

				element[0].children[0].ontouchstart=touchstartCallback;
				element[0].children[0].ontouchmove=touchmoveCallback;
				element[0].children[0].ontouchend=touchendCallback;
            },
            template:   '<div class="styledCheckBox" draggable="true">'+
							'<div class="checkBoxBackground " ng-class="isChecked ? \'selected\' : \'\'">'+
								'<div class="enableButton">'+
									
								'</div>'+
							'</div>'+
						'</div>'
		};
	}
})();