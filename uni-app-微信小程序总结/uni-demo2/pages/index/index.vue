<template>
  <view class="content">
    <uni-nav-bar
      left-icon="back"
      left-text="返回"
      right-text="菜单"
      title="导航栏组件"
    ></uni-nav-bar>
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <qiuwww-demo />

      <uni-group title="分组1" margin-top="20">
        <view>分组1 的内容</view>
        <view>分组1 的内容</view>
      </uni-group>

      <uni-group title="分组2">
        <view>分组2 的内容</view>
        <view>分组2 的内容</view>
      </uni-group>

      <button @click="open">打开弹窗</button>
      <uni-popup ref="popup" type="dialog">
        <uni-popup-dialog
          mode="base"
          message="成功消息"
          content="抱歉，根据互联网诊疗相关规定，您备案的疾病不支持线上复诊。若您需要就其他疾病进行在线问诊，可选择“自费支付”"
          :duration="2000"
          :before-close="true"
          @close="close"
          @confirm="confirm"
        ></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: 'Hello',
    };
  },
  onLoad() {
    let roomId = 1; // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    let customParams = encodeURIComponent(
      JSON.stringify({ path: 'pages/index/index', pid: 1 })
    ); // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`,
    });
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    /**
     * 点击取消按钮触发
     * @param {Object} done
     */
    close() {
      // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
      // ...
      this.$refs.popup.close();
    },
    /**
     * 点击确认按钮触发
     * @param {Object} done
     * @param {Object} value
     */
    confirm(value) {
      // 输入框的值
      console.log(value);
      // TODO 做一些其他的事情，手动执行 close 才会关闭对话框
      // ...
      this.$refs.popup.close();
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
