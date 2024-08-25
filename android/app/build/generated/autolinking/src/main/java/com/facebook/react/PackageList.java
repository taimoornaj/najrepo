package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-community/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/checkbox
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
// @react-native-community/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// @react-native-community/progress-bar-android
import com.reactnativecommunity.androidprogressbar.RNCProgressBarPackage;
// @react-native-community/progress-view
import com.reactnativecommunity.progressview.RNCProgressViewPackage;
// @react-native-masked-view/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @shopify/flash-list
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-audio-recorder-player
import com.dooboolab.audiorecorderplayer.RNAudioRecorderPlayerPackage;
// react-native-blob-util
import com.ReactNativeBlobUtil.ReactNativeBlobUtilPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-document-picker
import com.reactnativedocumentpicker.DocumentPickerPackage;
// react-native-drop-shadow
import com.dropShadow.DropShadowPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-i18n
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
// react-native-image-base64
import fr.snapp.imagebase64.RNImgToBase64Package;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-keychain
import com.oblador.keychain.KeychainPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-notifications
import com.wix.reactnativenotifications.RNNotificationsPackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-pdf
import org.wonday.pdf.RNPDFPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-restart
import com.reactnativerestart.RestartPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-shared-element
import com.ijzerenhein.sharedelement.RNSharedElementPackage;
// react-native-sound-player
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-version-check
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// rn-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new ReactCheckBoxPackage(),
      new ClipboardPackage(),
      new RNDateTimePickerPackage(),
      new RNCPickerPackage(),
      new RNCProgressBarPackage(),
      new RNCProgressViewPackage(),
      new RNCMaskedViewPackage(),
      new ReactNativeFlashListPackage(),
      new LottiePackage(),
      new RNAudioRecorderPlayerPackage(),
      new ReactNativeBlobUtilPackage(),
      new RNDeviceInfo(),
      new DocumentPickerPackage(),
      new DropShadowPackage(),
      new FastImageViewPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new RNI18nPackage(),
      new RNImgToBase64Package(),
      new PickerPackage(),
      new ImagePickerPackage(),
      new KeychainPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new RNNotificationsPackage(reactNativeHost.getApplication()),
      new PagerViewPackage(),
      new RNPDFPackage(),
      new ReactNativePushNotificationPackage(),
      new ReanimatedPackage(),
      new RestartPackage(),
      new RNScreensPackage(),
      new RNSharePackage(),
      new RNSharedElementPackage(),
      new RNSoundPlayerPackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new RNVersionCheckPackage(),
      new RNCWebViewPackage(),
      new RNFetchBlobPackage()
    ));
  }
}