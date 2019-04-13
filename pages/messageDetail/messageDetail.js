// pages/messageDetail/messageDetail.js
const app=getApp();
let _page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     status:0,//0:发布，1：已接未完成，2：已完成，3：发单者确认完成，4：未接
     msg:{
       id: "1",
       type: "buy",
       building: "楼栋",
       price: "￥3",
       room: "617",
       message: "找女朋友",
       date: "日期",
       time:"时间",
       address:"地址",
       remark:"备注信息",
       contact:"15234575643"
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        status:options.status,
        id: options.id
      }
    )
     
  },
  onShow(){
    _page=this;
    var myData = { id: this.data.id };
    wx.request({
      url: app.globalData.httpUrl +'/order/detail',
      method: "get",
      data: myData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (d) {
         if(!d.data.error){
           _page.setData({
             msg: d.data
           })
         }
      }
    })
  },
  handleReceiveTap(e) {

     if (!app.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/me/me',
      })
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      });
      return;
    }
    _page=this;
    if (!app.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/me/me',
      })
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      });
      return;
    }
    wx.showModal({
      title: '接单',
      content: '接单后不可轻易取消哦，是否确定？',
      confirmText: '确认接单',
      cancelText: '残忍拒绝',
      success(res) {
        if (res.confirm) {
          let myData={
            id:_page.data.msg.id,
            sId:app.globalData.id
            };
          wx.request({
            url: app.globalData.httpUrl +'/order/receive',
            method: "post",
            data: myData,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (d) {
              if (d.data == true){
                wx.showToast({
                  title: '接单成功！',
                  icon: 'success',
                  duration: 2000
                });
                _page.setData(
                  {
                    status:1
                  }
                )
              }
            }
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleFinishTap(){
    _page=this;
    wx.showModal({
      title: '确认完成',
      content: '是否确定订单已完成？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let myData={id:_page.data.msg.id};
          wx.request({
            url: app.globalData.httpUrl + '/order/finish',
            method:"post",
            data:myData,
            header:{
              "content-type": 'application/x-www-form-urlencoded'
            },
            success:function(res){
              if(res.data.suc){
                wx.showToast({
                  title: "已确认！",
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/help/help',
                  });
                },1500);
              }else{
                wx.showToast({
                  title: "出错了！",
                  icon: 'loading',
                  duration: 1500
                });
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})