// welcome/welcome.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    onLoad: function (options) {
        var that = this;
        //调用微信权限
        wx.getUserInfo({
            success: function (res) {
                console.log(res)
                var userName = res.userInfo.nickName;
                var userAvatar = res.userInfo.avatarUrl;
                app.globalData.userName = userName;
                app.globalData.userAvatar = userAvatar;
                that.setData({
                    userName: userName,
                    userAvatar: userAvatar
                })
            }
        })
    },
    goToHome() {
        wx.switchTab({
            url: '../pages/movies/movies',
        })
    }
})