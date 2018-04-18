// pages/my/my.js
var app = getApp();
Page({

  data: {
    sub: ""
  },

  onLoad: function (options) {
    var userName = app.globalData.userName;
    var userAvatar = app.globalData.userAvatar;
    var src = '../../images/pay.png'
    this.setData({
      userName: userName,
      userAvatar: userAvatar,
      scene: src
    })

  },

  goLogin() {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        //console.log(res)
        var userName = res.userInfo.nickName;
        var userAvatar = res.userInfo.avatarUrl;
        that.setData({
          userName: userName,
          userAvatar: userAvatar
        })
      }
    })
  },
  bindFormSubmit: function (event) {
    console.log(event.detail.value.textarea);
    this.setData({
      sub: ""
    })
    var that = this;
    wx.showModal({
      title: '提交成功！',
      content: '非常感谢您宝贵的意见！我们将不断改善，为您提供优质的产品和服务',
      showCancel: false
    })
  },
  previewImage: function (e) {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  }
})