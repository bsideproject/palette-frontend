
# react-native-kakao-connect

## Getting started

`$ npm install react-native-kakao-connect --save`

### Mostly automatic installation

`$ react-native link react-native-kakao-connect`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-kakao-connect` and add `RNKakaoConnect.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNKakaoConnect.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNKakaoConnectPackage;` to the imports at the top of the file
  - Add `new RNKakaoConnectPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-kakao-connect'
  	project(':react-native-kakao-connect').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-kakao-connect/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-kakao-connect')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNKakaoConnect.sln` in `node_modules/react-native-kakao-connect/windows/RNKakaoConnect.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Kakao.Connect.RNKakaoConnect;` to the usings at the top of the file
  - Add `new RNKakaoConnectPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNKakaoConnect from 'react-native-kakao-connect';

// TODO: What to do with the module?
RNKakaoConnect;
```
  