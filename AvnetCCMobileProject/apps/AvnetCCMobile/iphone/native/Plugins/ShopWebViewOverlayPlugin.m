//
//  ShopWebViewOverlayPlugin.m
//  ByerMobileappByerMobileAppIphone
//
//  Created by Manju Muthaiya on 27/10/14.
//
//

#import "ShopWebViewOverlayPlugin.h"

@implementation ShopWebViewOverlayPlugin 

UIWebView *shopWebView;
UIActivityIndicatorView *activityIndicator;

- (void)open:(CDVInvokedUrlCommand*)command{
    
    NSLog(@"Open CDV command called!");
    if (shopWebView == NULL) {
        [self initWebView];
    }
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://www.byerca.com"]];
    [shopWebView loadRequest:urlRequest];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


-(void) goToPage: (CDVInvokedUrlCommand*) command {
    
    NSArray *params = command.arguments;
    
    NSString *targetUrl = [params objectAtIndex:0];
    if (shopWebView == NULL) {
        [self initWebView];
    }
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:targetUrl]];
    [shopWebView loadRequest:urlRequest];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) goBack: (CDVInvokedUrlCommand*) command {
    NSLog(@"Going back");
    [shopWebView goBack];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) goForward: (CDVInvokedUrlCommand*) command {
    NSLog(@"Going fwd");

    [shopWebView goForward];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)close:(CDVInvokedUrlCommand*)command{
    NSLog(@"Close called!");
    [shopWebView removeFromSuperview];
    shopWebView=NULL;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) initWebView {
    CGRect rect = self.webView.bounds;
    rect.size.height -= 60;
    rect.origin.y = 20;
    activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    activityIndicator.center = CGPointMake(rect.size.width/2, rect.size.height/2);
    shopWebView = [[UIWebView alloc] initWithFrame:rect];
    shopWebView.delegate = self;
    [self.webView addSubview:shopWebView];
    [shopWebView addSubview:activityIndicator];
}

#pragma UIWebview delegate methods

- (void)webViewDidStartLoad:(UIWebView *)webView {
    NSLog(@"Start load");
    [activityIndicator startAnimating];

}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    NSLog(@"Finish load");
    [activityIndicator stopAnimating];
}

@end
