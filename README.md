# Avnet Channel Connection Mobile

The mobile companion for Avnet's partners.  From requests to invoices, partners can find it all here.


## Dependencies

1. Eclipse
2. IBM MobileFirst Studio
2. Android Studio 
3. Node & NPM
4. Gulp 
5. Bower

## Installation & Set Up

1. Pull the latest code from the repository
2. Navigate to app directory: apps/Avnet_R20_Zurb_Mobile_App
3. Install Global Node Dependencies: `npm install -g gulp bower`
4. Install Project Node Dependencies: `npm install`
5. Install Front End Dependencies: `bower install`


## Local Development

1. Ensure the application-descriptor.xml file does not identify security tests for the iphone or android environments
2. Update the constants.json file to reflect LOCAL = true
3. Run `gulp` to rebuild constants file

Note: existing Channel Connection remote functionality will not work

SHORTCUT. Run `gulp env --local` to change everything to local


## Build/Deploy for Test

SHORTCUT. Run `gulp env --test` to change everything to test (well basically just not local)

1. Ensure the application-descriptor.xml file has security tests for each environment (iphone and android)
2. Update the constants.json file to reflect LOCAL = false
3. Execute CL `gulp` to rebuild constants file
4. Run: Change build settings and deploy target to reflect: https://m-test.avnet.com and /worklight
5. Run: Build for all environments
6. Upload new .wlapp file to test environment
7. Upload any new or updated adapters to test environment
7. Run: Open as XCode project (or Android Studio)
8. For iOS add this to Resources/AvnetR2OZurb-Mobile-AppAvnetR20ZurbMobileAppIphone-Info.plist at the bottom:

<code>
<key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
</code>

...more coming...


## iOS Build for QA/TestFlight

1. Open project in XCode
2. Ensure the following '$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include' is added to HEADER SEARCH PATHS within the SEARCH PATHS section of Build Settings in XCode
3. Ensure enable bitcode is set to no
4. Ensure iPad fullscreen required is checked 
5. Ensure app target is selected (not Cordova)
5. Increment either build number or version
6. Product > Clean
7. Product > Archive (make sure device is generic)
8. Sign for Distribution

...more coming...


## Android Build for QA/Google BETA

1. Open project in Android Studio
2. Do a build
3. Generate signed APK

...more coming...


## Troubleshooting

You see: errors about the JSONStore

Probably an issue with dependencies.  Call Jonah at home!




## Test Accounts

conner.austin@siriuscom.com
mike.alley@us.logicalis.com
kevin.bailey@us.logicalis.com
tim.bake@us.logicalis.com
lizl@mobiuspartners.com
dmorton@qcmtech.com
Avnet100