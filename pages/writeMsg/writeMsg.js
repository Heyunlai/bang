// pages/writeMsg/writeMsg.js
const app = getApp();
let _page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    date:"点击选择日期",
    time:"点击选择时间",
   
  },
  staticData: {
    type: "拿东西",
    remark:"无",
    longitude: "",
    latitude: "",
  },
  onLoad(){
    this.setData({
      address: app.globalData.address,
      account: app.globalData.account,
      phone: app.globalData.phone,
      building: app.globalData.building,
      room: app.globalData.room
    });
    this.staticData.latitude = app.globalData.latitude;
    this.staticData.longitude = app.globalData.longitude;
  },
  handleAddressClick() {
    wx.chooseLocation({
      success: this.handleChooseLocationSucc.bind(this)
    })
  },
  handleChooseLocationSucc(res) {
    // console.log(res);
    this.setData({
      address: res.address
    });
    this.staticData.latitude=res.latitude;
    this.staticData.longitude=res.longitude;
  },
  handleTypeChange(e) {
    this.staticData.type = e.detail.value;
  },
  handleMessageChange(e) {
    this.staticData.message = e.detail.value;
  },
  handlePriceChange(e) {
    this.staticData.price = e.detail.value;
  },
  handleBuildChange(e) {
    this.setData({
      building : e.detail.value
    });
  },
  handleRoomChange(e) {
    this.setData({
      room: e.detail.value
    });
  },
  handleContactChange(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  handleRemarkChange(e) {
    this.staticData.remark = e.detail.value;
  },
  handleSubmit() {
    _page=this;
    if (!this.staticData.message) {
      wx.showToast({
        title: '请填写具体需求',
        icon: 'loading',
        duration: 2000
      })
      return;
  } else if (!this.data.date || this.data.date === "点击选择日期") {
    wx.showToast({
      title: '请选择日期',
      icon: 'loading',
      duration: 2000
    })
    return;
  } else if (!this.data.time || this.data.time === "点击选择时间") {
    wx.showToast({
      title: '请选择时间',
      icon: 'loading',
      duration: 2000
    })
    return;
  }else if (!this.staticData.price ) {
      wx.showToast({
        title: '请填写预给小费',
        icon: 'loading',
        duration: 2000
      })
      return;
  } else if (!this.data.address || this.data.address === "点击选择，要勾选哦~") {
    wx.showToast({
      title: '请填写地址',
      icon: 'loading',
      duration: 2000
    })
    return;
  }   else if (!this.data.building) {
      wx.showToast({
        title: '请填写楼栋',
        icon: 'loading',
        duration: 2000
      })
      return;
  } else if (!this.data.room) {
    wx.showToast({
      title: '请填写房间号',
      icon: 'loading',
      duration: 2000
    })
    return;
    } else if (!this.data.phone) {
    wx.showToast({
      title: '请填写联系信息',
      icon: 'loading',
      duration: 2000
    })
    return;
  }else {
      let d = JSON.parse(JSON.stringify(this.data));
      d.dateTime=d.date+" "+d.time;
      delete d.date;
      delete d.time;

      const data = Object.assign({}, this.staticData,d, {
        uId: app.globalData.id,
        isFinish:0
      });
        console.log(data);

      wx.showModal({
        title: '发单',
        content: '是否确定发单？',
        confirmText: '确认发单',
        cancelText: '再想想',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.httpUrl +'/order/add',
              data: data,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: _page.handleSubmitSucc.bind(_page)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

     
    }
  },
  handleSubmitSucc(res) {
    // console.log(res);
    if(!res.data){
      wx.showToast({
        title: '未知错误，发单失败',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '发单成功！',
        icon: 'success',
        duration: 2000
      });
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/help/help',
        })
      },2000)
    }
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value+":00"
    })
  },

})