using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Kakao.Connect.RNKakaoConnect
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNKakaoConnectModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNKakaoConnectModule"/>.
        /// </summary>
        internal RNKakaoConnectModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNKakaoConnect";
            }
        }
    }
}
