//app.js
App({
  globalData: {
    isLogin: false,
    pageNum:1,
    pages:1,
    httpUrl:"http://192.168.43.142:8080"
  },
  onLaunch: function () {
    try {
      const res = wx.getSystemInfoSync();
      this.globalData.windowHeight = res.windowHeight;
      this.globalData.windowWidth = res.windowWidth;
    } catch (e) {
      // Do something when catch error
    }
  }
})