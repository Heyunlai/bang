// pages/nearMap/nearMap.js
const app = getApp()
let _page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      longitude: "",
      latitude: "",
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
 
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      longitude: options.longitude,
      latitude: options.latitude
    })
  },
  onShow(){
    this.getBangMessages();
  } ,
  getBangMessages() {
    _page=this;
    wx.request({
      url: app.globalData.httpUrl+'/order/getNear',
      data: {
        longitude:_page.data.longitude,
        latitude:_page.data.latitude
      },
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: this.handleGetSucc.bind(this)
    })
  },
  handleGetSucc(res) {
    if (res.data && res.data.length > 0){
      let markers = res.data;
      for (let obj of markers){
        obj.iconPath= '/resources/mark.png';
        obj.width=40;
        obj.height=40;
     }
     this.setData({
       markers:markers
     })
    }
    
  }
})