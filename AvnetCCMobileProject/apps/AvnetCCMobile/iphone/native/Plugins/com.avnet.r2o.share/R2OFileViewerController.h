//
//  R2OFileViewerController.h
//  AvnetR2OZurb-Mobile-AppAvnetR20ZurbMobileAppIphone
//
//  Created by Srinivasan, Dodda on 06/04/15.
//
//

#import <UIKit/UIKit.h>

@interface R2OFileViewerController : UIViewController

@property (strong, nonatomic) IBOutlet UIWebView *fileViewer;
- (IBAction)closeWebView:(id)sender;
@property (strong, nonatomic) NSData *fileData;
@property (strong, nonatomic) NSString *fileType;
@end
