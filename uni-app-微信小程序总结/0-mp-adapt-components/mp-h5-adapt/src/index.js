import { loadScript } from './utils/index';

class MpH5Adapt {
  // 引入小程序文件，测试一下条件编译，https://uniapp.dcloud.io/platform?id=%e6%9d%a1%e4%bb%b6%e7%bc%96%e8%af%91
  init = () => {
    // #ifdef H5
    this.h5Init();
    // #endif
  };

  h5Init = () => {
    // 微信小程序 JS-SDK 如果不需要兼容微信小程序，则无需引用此 JS 文件。
    loadScript(
      '//static.91jkys.com/attachment/20210316204652605_db936fce9cf540e89ae70226ea953f44.js'
    ).then((res) => {
      console.log('window.wx', window.wx);
    });
  };

  setShareConfig = (shareConfig) => {
    

  };
}

export default MpH5Adapt;
