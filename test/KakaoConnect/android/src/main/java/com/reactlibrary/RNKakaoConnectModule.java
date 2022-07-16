
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.kakao.kakaolink.v2.KakaoLinkService;
import com.kakao.kakaolink.v2.KakaoLinkResponse;
import com.kakao.message.template.FeedTemplate;
import com.kakao.message.template.LinkObject;
import com.kakao.message.template.ButtonObject;
import com.kakao.message.template.SocialObject;
import com.kakao.message.template.ContentObject;

import com.kakao.network.callback.ResponseCallback;
import com.kakao.network.ErrorResult;

import java.util.Map;
import java.util.HashMap;

public class RNKakaoConnectModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNKakaoConnectModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNKakaoConnect";
  }

  @ReactMethod  
  public void foo(final Callback callback) {
    callback.invoke();
  }

  @ReactMethod
  public void link(final Callback successCallback) {
      FeedTemplate params = FeedTemplate
                  .newBuilder(ContentObject.newBuilder("카카오 공유 테스트",
                  "https://s3.ap-northeast-2.amazonaws.com/zeroweb-web-share/chakangost/zerogo_kakao_share.jpg",
                  LinkObject.newBuilder().setWebUrl("https://developers.kakao.com")
                          .setMobileWebUrl("https://developers.kakao.com").build())
                  .build())
                  .addButton(new ButtonObject("앱에서 보기", LinkObject.newBuilder()
                          .setWebUrl("'https://developers.kakao.com")
                          .setMobileWebUrl("'https://developers.kakao.com")
                          .setAndroidExecutionParams("key1=value1")
                          .setIosExecutionParams("key1=value1")
                          .build()))
                  .build();
      Map<String, String> serverCallbackArgs = new HashMap<String, String>();
      serverCallbackArgs.put("user_id", "${current_user_id}");
      serverCallbackArgs.put("product_id", "${shared_product_id}");

      KakaoLinkService.getInstance().
          sendDefault(this.getCurrentActivity(),
                      params, serverCallbackArgs,
                      new ResponseCallback<KakaoLinkResponse>() {
                          @Override
                          public void onFailure(ErrorResult errorResult) {
                              successCallback.invoke(errorResult.toString());
                          }

                          @Override
                          public void onSuccess(KakaoLinkResponse result) {
                              successCallback.invoke(result);
                          }
                      });
  }
}