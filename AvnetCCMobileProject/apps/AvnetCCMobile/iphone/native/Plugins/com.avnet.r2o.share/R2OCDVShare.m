#import <Cordova/CDV.h>
#import "R2OCDVShare.h"
#import "R2OFileViewerController.h"
#import <MobileCoreServices/MobileCoreServices.h>

@implementation R2OCDVShare

- (void)shareItem:(CDVInvokedUrlCommand*)command
{
    if([MFMailComposeViewController canSendMail])
    {
        NSMutableDictionary* options = [command.arguments objectAtIndex:0];
        
        R2OFileViewerController *fileOpener = [[R2OFileViewerController alloc] initWithNibName:@"R2OFileViewerController" bundle:nil];
        MFMailComposeViewController *mailController = [[MFMailComposeViewController alloc] init];
        [mailController setMailComposeDelegate:self];
        [mailController setSubject:[NSString stringWithFormat:@"Shared %@", [options objectForKey:@"requestName"]]];
        [mailController setMessageBody:[NSString stringWithFormat:@"The following request was shared with you for %@", [options objectForKey:@"requestName"]] isHTML:NO];
        
        NSURL *url = [NSURL URLWithString: [options objectForKey:@"url"]];
        
        NSHTTPURLResponse *response = nil;
        NSError *error = nil;
        
        NSURLRequest *request = [NSURLRequest requestWithURL:url];
        
        // Create a mutable copy of the immutable request and add more headers
        NSMutableURLRequest *mutableRequest = [request mutableCopy];
        [mutableRequest addValue:[options objectForKey:@"Cookie"] forHTTPHeaderField:@"Cookie"];
        [mutableRequest addValue:[options objectForKey:@"R2oSessionId"] forHTTPHeaderField:@"R2oSessionId"];
        
        // Now set our request variable with an (immutable) copy of the altered request
        request = [mutableRequest copy];
        NSData *imageData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:nil];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
        CFStringRef type = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)([options objectForKey:@"extension"]), NULL);
        NSString *mimeType = (__bridge_transfer NSString *)UTTypeCopyPreferredTagWithClass(type, kUTTagClassMIMEType);
        if(imageData.length){
            if ([@"shareItem" isEqualToString:[options objectForKey:@"action"]]){
                [mailController addAttachmentData:imageData mimeType:mimeType fileName:[options objectForKey:@"filename"]];
                [self.viewController presentViewController:mailController animated:YES completion:^{
                }];
            }else if([@"open" isEqualToString:[options objectForKey:@"action"]]){
                [self.viewController presentViewController:fileOpener animated:YES completion:nil];
                [fileOpener.fileViewer loadData:imageData MIMEType:mimeType textEncodingName:@"utf-8" baseURL:nil];
            }
        }else{
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Download Failed" message:@"The file couldn't be retrived." delegate:nil cancelButtonTitle:nil otherButtonTitles:@"Ok", nil];
            [alert show];
        }
    }
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error{
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
}

@end
