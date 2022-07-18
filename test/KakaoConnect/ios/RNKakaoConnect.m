
#import "RNKakaoConnect.h"

// #import <React/RCTLog.h>
// #import <KakaoLink/KakaoLink.h>
// #import <KakaoMessageTemplate/KakaoMessageTemplate.h>

@implementation RNKakaoConnect

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

// RCT_EXPORT_METHOD(link:(RCTResponseSenderBlock)callback)
// {
//     KMTTemplate *template = [KMTFeedTemplate feedTemplateWithBuilderBlock:^(KMTFeedTemplateBuilder * _Nonnull feedTemplateBuilder) {

//         // 콘텐츠
//         feedTemplateBuilder.content = [KMTContentObject contentObjectWithBuilderBlock:^(KMTContentBuilder * _Nonnull contentBuilder) {
//             contentBuilder.title = @"카카오 공유 테스트";
//             contentBuilder.imageURL = [NSURL URLWithString:@"https://s3.ap-northeast-2.amazonaws.com/zeroweb-web-share/chakangost/zerogo_kakao_share.jpg"];
//             contentBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
//                 linkBuilder.mobileWebURL = [NSURL URLWithString:@"https://developers.kakao.com"];
//             }];
//         }];


//         // 버튼
//         [feedTemplateBuilder addButton:[KMTButtonObject buttonObjectWithBuilderBlock:^(KMTButtonBuilder * _Nonnull buttonBuilder) {
//             buttonBuilder.title = @"앱에서 보기";
//             buttonBuilder.link = [KMTLinkObject linkObjectWithBuilderBlock:^(KMTLinkBuilder * _Nonnull linkBuilder) {
//                 linkBuilder.iosExecutionParams = @"param1=value1&param2=value2";
//                 linkBuilder.androidExecutionParams = @"param1=value1&param2=value2";
//             }];
//         }]];
//     }];

//     [[KLKTalkLinkCenter sharedCenter] sendDefaultWithTemplate:template success:^(NSDictionary<NSString *,NSString *> * _Nullable warningMsg, NSDictionary<NSString *,NSString *> * _Nullable argumentMsg) {
//         // 성공
//         RCTLogInfo(@"warning message: %@", warningMsg);
//         RCTLogInfo(@"argument message: %@", argumentMsg);
//     } failure:^(NSError * _Nonnull error) {
//         // 에러
//         RCTLogInfo(@"error: %@", error);
//     }];
// }

@end
  