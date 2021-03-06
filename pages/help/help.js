// pages/help/help.js
const app = getApp();
let _page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpDisplay1:false,
    helpDisplay2: false,
    requsetDisplay1: false,
    requsetDisplay2: false,
    requsetDisplay3: false,
    help1:[],
    help2: [],
    request1: [],
    request2: [],
    request3: []
  },

  onShow: function (options) {
    _page=this;
    let help1=[],help2=[],request1=[],request2=[],request3=[];
    if (app.globalData.isLogin){
      wx.request({
        url: app.globalData.httpUrl + '/order/getMyMsg',
        method:"get",
        data: { id: app.globalData.id},
        header:{
          "content-type": 'application/x-www-form-urlencoded'
        },
        success:function(res){
          if(res.data){
            if(res.data.help){
              for (var obj of res.data.help){
                if(obj.isFinish==1){
                   help1.push(obj);
                }
                if(obj.isFinish==2){
                  help2.push(obj);
                }
              }
              _page.setData({
                help1: help1,
                help2: help2
              })
               
            };
            if(res.data.request){
              for (var obj of res.data.request) {
                if (obj.isFinish == 1) {
                 request1.push(obj);
                }
                if (obj.isFinish == 2) {
                  request2.push(obj);
                }
                if (obj.isFinish == 0) {
                  request3.push(obj);
                }
              }
              _page.setData({
                request1: request1,
                request2: request2,
                request3: request3
              })
            }
          }
        }
      })

    } else{
      wx.showToast({
        title: '请登录哦！！',
        icon: 'loading',
        duration: 1000
      });
    }
  },
  handleHelpMsgDisplayTap1(){
    _page=this;
    if (_page.data.helpDisplay1){
      _page.setData(
        {
          helpDisplay1:false
        }
      )
    }else{
      _page.setData(
        {
          helpDisplay1: true
        }
      )
    }
  },
  handleHelpMsgDisplayTap2() {
    _page = this;
    if (_page.data.helpDisplay2) {
      _page.setData(
        {
          helpDisplay2: false
        }
      )
    } else {
      _page.setData(
        {
          helpDisplay2: true
        }
      )
    }
  },
  handleRequestChange2(){
    if (this.data.requsetDisplay2){
      this.setData(
        {
          requsetDisplay2:false
        }
      )
    }else{
      this.setData(
        {
          requsetDisplay2:true
        }
      )
    }
  },
  handleRequestChange1() {
    if (this.data.requsetDisplay1) {
      this.setData(
        {
          requsetDisplay1: false
        }
      )
    } else {
      this.setData(
        {
          requsetDisplay1: true
        }
      )
    }
  },
  handleRequestChange3() {
    if (this.data.requsetDisplay3) {
      this.setData(
        {
          requsetDisplay3: false
        }
      )
    } else {
      this.setData(
        {
          requsetDisplay3: true
        }
      )
    }
  },
 
  handleDetailTap1(e) {
    //前往等待确认完成页面
    if (!app.inspectLongin()){
      return;
    };
    wx.navigateTo({
      url: "/pages/messageDetail/messageDetail?id=" + e.currentTarget.id + '&status=' + 1,
    })
  },
  handleDetailTap2(e) {
    if (!app.inspectLongin()) {
      return;
    };
   //前往已完成页面
    wx.navigateTo({
      url: "/pages/messageDetail/messageDetail?id=" + e.currentTarget.id + '&status=' + 2,
    })
  },
  handleDetailTap3(e){
    if (!app.inspectLongin()) {
      return;
    };
    //前往确认完成页面
    wx.navigateTo({
      url: "/pages/messageDetail/messageDetail?id=" + e.currentTarget.id + '&status=' + 3,
    })
  },
  handleDetailTap4(e) {
    if (!app.inspectLongin()) {
      return;
    };
    //前往未接页面
    wx.navigateTo({
      url: "/pages/messageDetail/messageDetail?id=" + e.currentTarget.id + '&status=' + 4,
    })
  }
 
})