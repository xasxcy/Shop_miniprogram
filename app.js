// app.js
App({ // 在js中，大括号表示对象
  onLaunch() { // 第一个属性，是一个函数；整个小程序的主函数
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({ 
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: { // 小程序的全局变量
    // 第二个属性globalData是一个变量，变量的变量的值是空
    userInfo: null,
    api: 'http://localhost:8080/' // 请求网站的ip地址
  }
})
