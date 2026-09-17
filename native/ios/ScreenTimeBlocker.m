// Pont Objective-C requis pour exposer la classe Swift ScreenTimeBlocker
// au bridge React Native (le mécanisme classique pré-Turbo Modules).
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenTimeBlocker, NSObject)

RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(pickDistractingApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startShielding:(NSArray *)appTokens
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopShielding:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
