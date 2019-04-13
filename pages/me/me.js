const app = getApp();
let _page;
Page({
  data: {
    isLogin:false,
    alter:false,
    register:false,
    rAccount:null,
    rPassword1:null,
    rPassword2:null,
    tempAddress:"南宫111111111111111111111",
    account:"7680921",
    nickName:"夜月",
    phone:"15768934203",
    address:"南宫111111111111111111111",
    building:"怡红楼",
    room:"2号",
    score:"100",
    password:"-",
    longitude: "",
    latitude: "",
  },
  tempData:{

  },
  onLoad: function () {

  },
  onShow(){

  },
  handleSubmit(){
    _page = this;
    _page.setData({
            isLogin:true,
           
          });
  
    if (!this.data.account || this.data.account =="7680921"){
      wx.showToast({
        title: '请输入账号',
        icon: 'loading',
        duration: 1500
      })
       return;
    } else if (!this.data.password || this.data.password == "11"){
      wx.showToast({
        title: '请输入密码',
        icon: 'loading',
        duration: 1500
      })
      return;
    }else{
      wx.request({
        url: app.globalData.httpUrl+'/user/login',
        method:"post",
        data: { "account": _page.data.account, "password": _page.data.password},
        header:{
          'content-type': 'application/json'
        },
        success: function (d) {
          if(d.data.error){
            wx.showToast({
              title: '出错误了！',
              icon: 'loading',
              duration: 1000
            })
            return;
          }
          if(d.data==null||d.data==""){
            wx.showToast({
              title: '账号或密码错误！',
              icon: 'loading',
              duration: 1000
            })
            return;
          }
          _page.setData({
            isLogin:true,
            tempAddress: d.data.address,
            id: d.data.id,
            nickName: d.data.nickName,
            phone: d.data.phone,
            address: d.data.address,
            building: d.data.building,
            room: d.data.room,
            score: d.data.score,
            longitude: d.data.longitude,
            latitude: d.data.latitude,
          });
          app.globalData.isLogin = true;
          app.globalData.id = d.data.id,
          app.globalData.account = _page.data.account;
          app.globalData.nickName = d.data.nickName;
          app.globalData.phone = d.data.phone;
          app.globalData.address = d.data.address;
          app.globalData.building = d.data.building;
          app.globalData.room = d.data.room;
          app.globalData.score = d.data.score;
          app.globalData.longitude = d.data.longitude;
          app.globalData.latitude = d.data.latitude;
        }
      })
    }
   
  },
  handleAccountChange(e){
    this.setData({
      account: e.detail.value
    })
  },
  handlePasswordChange(e){
    this.setData({
      password: e.detail.value
    })
  },
  handleExitTap(){
    this.setData({
      isLogin:false,
      account:null,
      password:null
    });
    this.tempData={};
    app.globalData.isLogin = false;
  },
  handleAlterTap(){
    this.setData({
      alter: true
    });
  },
  handleCancelAlter(){
    this.setData({
      alter: false
    });
  },

  handleAddressClick() {
    wx.chooseLocation({
      success: this.handleChooseLocationSucc.bind(this)
    })
  },
  handleChooseLocationSucc(res) {
    this.setData({
      tempAddress: res.address
    });
    this.tempData.address = res.address;
    this.tempData.longitude = res.longitude;
    this.tempData.latitude = res.latitude;
  },
  handleSubmitAlter(){
    _page=this;
    wx.showModal({
      title: '修改资料',
      content: '是否确定修改资料？',
      confirmText: '确定',
      cancelText: '放弃',
      success(res) {
        if (res.confirm) {
          if (JSON.stringify(_page.tempData)=="{}"){
            wx.showToast({
              title: '资料未修改！',
              icon: 'loading',
              duration: 1500
            })
            return;
          }else{
            var myData = JSON.parse(JSON.stringify(_page.data));
            delete myData.isLogin;
            delete myData.alter;
            delete myData.tempAddress;
            
            Object.assign(myData,_page.tempData,{address:_page.data.tempAddress});
               
            wx.request({
              url: app.globalData.httpUrl +'/user/alter',
            method: "post",
            data: myData,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(d){
               
               if(d.data){
                 wx.showToast({
                   title: '修改成功！',
                   icon: 'success',
                   duration: 1500
                 });
                 _page.setData(_page.tempData);
                 console.log(_page.data);
                 app.globalData.nickName = myData.nickName;
                 app.globalData.phone = myData.phone;
                 app.globalData.address = myData.address;
                 app.globalData.building = myData.building;
                 app.globalData.room = myData.room;
                 app.globalData.longitude = myData.longitude;
                 app.globalData.latitude = myData.latitude;
               }else{
                 wx.showToast({
                   title: '修改失败！',
                   icon: 'loading',
                   duration: 1500
                 })
               }
            }
          })

          }
        } else if (res.cancel) {
          console.log('用户点击取消');
          _page.setData({
            alter: false
          });
        }
      }
    })
  },



  handleNickNameAlter(e){
    this.tempData.nickName = e.detail.value;
  },
  handleBuildingAlter(e) {
    this.tempData.building = e.detail.value;
  },
  handleRoomAlter(e) {
    this.tempData.room = e.detail.value;
  },
  handlePhoneAlter(e) {
    this.tempData.phone = e.detail.value;
  },
  handlePasswordAlter() {
    this.tempData.password = e.detail.value;
  },
  handleRegister(){
    this.setData({
      register:true
    })
  },
  handleRAccountChange(e){
    this.setData({
      rAccount: e.detail.value
    })
  },
  handleRPassword1Change(e){
    this.setData({
      rPassword1: e.detail.value
    })
  },
  handleRPassword2Change(e){
    this.setData({
      rPassword2: e.detail.value
    })
  } ,
   handleDoRegister(){
     _page=this;
     if (!this.data.rAccount){
      wx.showToast({
        title: '请输入注册账号',
        icon: 'loading',
        duration: 1000
      })
      return;
     }
     if (!this.data.rPassword1){
       wx.showToast({
         title: '请输入注册密码',
         icon: 'loading',
         duration: 1000
       })
       return;
     }
     if (!this.data.rPassword2) {
       wx.showToast({
         title: '请输入再次密码',
         icon: 'loading',
         duration: 1000
       })
       return;
     }
     if (this.data.rPassword1 == this.data.rPassword2){
       let user={
         account:this.data.rAccount,
         password:this.data.rPassword1
        }
        wx.request({
          url: app.globalData.httpUrl + '/user/register',
          method: "post",
          data: user,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (d) {
            console.log(d.data);
            if(d.data.suc){
              wx.showToast({
                title: '注册成功！',
                icon: 'success',
                duration: 1000
              });
              setTimeout(function () {
                _page.setData({
                  register:false
                })
              }, 1000);
            }else{
              wx.showToast({
                title: d.data.msg,
                icon: 'loading',
                duration: 1000
              });
            }
          }
        })
     }else{
       wx.showToast({
         title: '两次密码不同！',
         icon: 'loading',
         duration: 1000
       })
       this.setData({
         rPassword2: null,
         rPassword1:null
       })
     }
   },
  handleToLogin(){
    this.setData({
      register:false
    })
  }
})
