//app.js
App({
  globalData: {
    isLogin: false,
    pageNum:1,
    pages:1,
    httpUrl:"http://192.168.1.103:8080"
  },
  onLaunch: function () {
    try {
      const res = wx.getSystemInfoSync();
      this.globalData.windowHeight = res.windowHeight;
      this.globalData.windowWidth = res.windowWidth;
    } catch (e) {
      // Do something when catch error
    }
  },
  inspectLongin:function(){
    if (!this.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/me/me',
      })
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else {
      return true;
    }
  }
})