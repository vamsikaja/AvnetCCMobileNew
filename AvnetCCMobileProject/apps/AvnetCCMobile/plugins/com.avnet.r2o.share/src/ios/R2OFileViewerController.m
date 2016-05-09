//
//  R2OFileViewerController.m
//  AvnetR2OZurb-Mobile-AppAvnetR20ZurbMobileAppIphone
//
//  Created by Srinivasan, Dodda on 06/04/15.
//
//

#import "R2OFileViewerController.h"

@interface R2OFileViewerController ()

@end

@implementation R2OFileViewerController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)closeWebView:(id)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}
@end
