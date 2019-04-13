//index.js
//获取应用实例
const app = getApp()
let keys = 'SGXBZ-6X3K6-NYLSF-MALZD-QC6PK-BABOS';
let _page;

Page({
  data:{
    
    height: app.globalData.windowHeight,
    longitude: "11.6",
    latitude: "11.5",
    district: " 区",
    region: "[province, city, district]",
    msgArray:[
      {
        id:"1",
        nickName:"昵称示例",
        faceSrc:"/resources/msg.png",
        type:"类型示例",
        building:"楼栋示例",
        price:"3",
        room:"房间示例",
        message:"事务示例",
        dateTime:"时间示例"
      }
    ]
  },
  staticData:{
    address: ''
  },
  onShow(){
     wx.getLocation({
       type: 'gcj02',
       success: this.handleGetLocationSucc.bind(this),
       fail:function(){
        
           wx.showToast({
             title: '获取位置失败！',
             icon: "loading",
             duration: 2000
           })
         
       }
       });

       app.globalData.pageNum=1;
       
  },
  handleGetLocationSucc(res){
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude
    });
    this.loadCity(res.longitude, res.latitude);
    if(res.latitude!=""&&res.longitude!=""){
        this.setData({
          msgArray: []
        })
        this.getMoreMsg();
    }
    
  },
  handleNearMsgTap(){
 
     const latitude=this.data.latitude;
     const longitude=this.data.longitude;
    wx.navigateTo({
      url: '/pages/nearMap/nearMap?latitude=' + latitude + '&longitude=' + longitude
    })
  }, 
  handleOpenLocationTap(){
    // wx.chooseLocation({
    //   success: this.handleChooseLocationSucc.bind(this)
    // })
  },
  loadCity: function (longitude, latitude) {
    _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 省
        let province = res.data.result.address_component.province;
        // 市
        let city = res.data.result.address_component.city;
        // 区
        let district = res.data.result.address_component.district;

        _page.setData({
          district: res.data.result.address_component.district,
          region: [province, city, district]
        })
      }
    })
  },
  handleChooseLocationSucc(res) {
    this.setData({
      address: res.address
    });
  },
  handleMoreMessage(){
    _page=this;
    
    
    if(app.globalData.pageNum<=app.globalData.pages){
      _page.getMoreMsg();
    }else{
      wx.showToast({
        title: "到底了哦~",
        icon: 'loading',
        duration: 500
      });
    }

  },
  handleWriteHelpMessageTap(){
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
    wx.navigateTo({
      url: '/pages/writeMsg/writeMsg',
    })
  },
  handleDetailTap(e){
    // if (!app.globalData.isLogin) {
    //   wx.switchTab({
    //     url: '/pages/me/me',
    //   })
    //   wx.showToast({
    //     title: '请先登录',
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   return;
    // }
    wx.navigateTo({
      url: "/pages/messageDetail/messageDetail?id="+e.target.id+'&status='+0,
    })
  },
  handleReceiveTap(e){
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
    console.log(e.target.id);
    _page=this;
    wx.showModal({
      title: '接单',
      content: '接单后不可轻易取消哦，是否确定？',
      confirmText:'确认接单',
      cancelText:'残忍拒绝',
      success(res) {
        
        if (res.confirm) {
          console.log('用户点击确定');
          let myData = { id: e.target.id ,sId:app.globalData.id}
          wx.request({
            url: app.globalData.httpUrl +'/order/receive',
            method: "post",
            data: myData,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (d) {
              if (d.data == true) {
                wx.showToast({
                  title: '接单成功！',
                  icon: 'success',
                  duration: 2000
                });
                wx.navigateTo({
                  url: "/pages/messageDetail/messageDetail?id=" + e.target.id + '&status=' + 1,
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getMoreMsg(){
    _page=this;

    var Arr = _page.data.msgArray;
    var myData = {
      "pageNum": app.globalData.pageNum,
      "pageSize": 4,
      "latitude": _page.data.latitude,
      "longitude": _page.data.longitude
    }
    wx.request({
      url: app.globalData.httpUrl +'/order/getMore',
      method: "get",
      data: myData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (d) {
        console.log()
        if (d.data.list.length != 0) {
          _page.setData({ msgArray: Arr.concat(d.data.list) });
          app.globalData.pages = d.data.pages;
          app.globalData.pageNum = parseInt(app.globalData.pageNum) + 1;

        } else {
          wx.showToast({
            title: '数据获取失败',
            icon: 'loading',
            duration: 2000
          });
        }
      },
    });
  }
})
