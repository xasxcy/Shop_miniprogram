// pages/cart.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    api: app.globalData.api,
    product: [], //购物车商品列表
    total: 0,    // 总价
    name: "", // 个人信息三项
    mobile: "",
    address: ""
  },
  onLoad: function (options) {
    // 从本地缓存中取出数据
    this.data.name = wx.getStorageSync('name')
    this.data.mobile = wx.getStorageSync('mobile')
    this.data.address = wx.getStorageSync('address')

    this.data.product = util.getStorageCart('cart', 'id', 'count')
    this.setData(this.data)
    this.data.total = 0;
    for (var i in this.data.product) {  // js的for循环
      this.data.product[i].fee = this.data.product[i].price * this.data.product[i].count
      this.data.total += this.data.product[i].fee
    }
    this.setData(this.data)
  },
  onTabItemTap: function() { // 点击tab按钮时，这个函数会被调用
    this.onLoad() // 再一次调用主函数
  },
  addCart: function(e){
    var item = e.currentTarget.dataset.item
    var len = util.enableAddStorageObj('cart', 'id', 'num', item, function () { // 参数解释：往“cart”页面放入“主键名” “num个” “当前对象” “回调函数”
      util.alert(item.product + '售罄了！') // 返回购物车里有多少个商品
    })
    util.setTabBarBadgeNumber(1, len) // 设置tabbar红色数字角标
    this.onLoad()
  },
  reduceCart: function(e){
    var item = e.currentTarget.dataset.item
    var len = util.delStorageObj('cart', 'id', item.id)
    util.setTabBarBadgeNumber(1, len) // 设置tabbar红色数字角标
    this.onLoad()
  },
  onInput: function (e) { // 把输入框输入的内容赋值给对应的变量name/mobile/address
    // util.alert(e.currentTarget.dataset.name) // 弹出“name”的内容，因为wxml使用的是“data-name”标签
    // util.alert(e.detail.value) // 输入框边写边弹出其内容
    this.data[e.currentTarget.dataset.name] = e.detail.value// []也是.的意思，不同是因为这个name是一个字符串
  },
  submit: function() {
    util.alert(this.data.name+','+this.data.mobile+','+this.data.address)
    util.httpPost('/wx/order', {  // {}代表对象
      name: this.data.name,
      mobile: this.data.mobile,
      address: this.data.address,
      total: this.data.total,  // 计算是在onLoad里进行的
      json: JSON.stringify(this.data.product) 
      // http请求可以发送字符串、整型、浮点型，但是不能发送对象和数组。所以只能转换成json字符串的形式发送。
      // 在js中，有一个JSON对象，专门用于json字符串的生成和解析。stringify就是把对象转换为json字符串
    }, resp=>{  
      if(resp.code == 1){ // 成功了
        // 保存上一次购物地址
        // wx.setStorageSync本地缓存，这是购物车核心代码。
        // 本地缓存是小程序内部的缓存，在卸载小程序或微信的时候会全部丢失
        // 关键数据存入数据库中，其他数据需要时存在本地缓存即可
        wx.setStorageSync('name', this.data.name)
        wx.setStorageSync('mobile', this.data.mobile)
        wx.setStorageSync('address', this.data.address)
        wx.setStorageSync('cart', '')  // 清空购物车
        util.setTabBarBadgeNumber(1, 0) // 清除小红点
        this.data.product = [] // 购物车清空
        this.data.total = 0 // 购买总数清零
        this.setData(this.data)
      } else {  // 失败了
        util.alert(resp.msg)
      }
    })
  }
})