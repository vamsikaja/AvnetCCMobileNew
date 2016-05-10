//
//  ShopWebViewOverlayPlugin.h
//  ByerMobileappByerMobileAppIphone
//
//  Created by Manju Muthaiya on 27/10/14.
//
//

#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>

@interface ShopWebViewOverlayPlugin : CDVPlugin<UIWebViewDelegate>

@property (nonatomic, copy) NSString* callbackId;

@end
