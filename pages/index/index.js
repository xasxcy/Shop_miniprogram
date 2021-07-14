const util = require('../../utils/util.js')
const app = getApp() // 获取app.js
Page({  // Page是一个函数
  data: { // 这个页面的全局变量
      api: app.globalData.api, // 全局的api赋给页面的api
      indicatorDots: true, // 指示器true
      autoplay: true,  // 自动播放true
      interval: 4000, // 间隔时间4s
      duration: 2000, // 持续时间2s
      imgUrls: [],
      category: [],
      product: [],
      cid: 0 // 初始化为0
  },
  onLoad: function() { // 这个页面的主函数
    util.httpGet('/wx/index', resp=>{
      // util.alert(resp); //测试是否获得了数据
      this.data.category = resp.category
      if(this.data.category && this.data.category.length > 0){
          this.data.cid = this.data.category[0].id;
      }
      this.data.product = resp.product
      util.getStorageCart('cart', 'id', 'count', this.data.product) // 把同类商品折合计数
      this.data.imgUrls = resp.hot
      this.setData(this.data) // 把数据更新到页面上
    },
    util.setTabBarBadgeNumber(1, util.getStorageObj('cart').length)
    )
  }, 
  // 小程序js语句末尾分号可加可不加，但行业习惯不加。
  // 网页js行业习惯加分号，但也可以不加
  clickCategory: function(e){
    this.data.cid = e.currentTarget.dataset.item.id
    util.httpGet('/wx/index?cid=' + this.data.cid, resp=>{
      this.data.product = resp.product
      util.getStorageCart('cart', 'id', 'count', this.data.product) // 把同类商品折合计数
      this.setData(this.data) // 把数据更新到页面上，别忘了这句！
    })
  },
  addCart: function(e){
    var item = e.currentTarget.dataset.item
    var len = util.enableAddStorageObj('cart', 'id', 'num', item, function () { // 参数解释：往“cart”页面放入“主键名” “num个” “当前对象” “回调函数”
      util.alert(item.product + '售罄了！') // 返回购物车里有多少个商品
    })
    util.setTabBarBadgeNumber(1, len) // 设置tabbar红色数字角标
    util.getStorageCart('cart', 'id', 'count', this.data.product) // 把同类商品折合计数
    this.setData(this.data)
  },
  reduceCart: function(e){
    var item = e.currentTarget.dataset.item
    var len = util.delStorageObj('cart', 'id', item.id)
    util.setTabBarBadgeNumber(1, len) // 设置tabbar红色数字角标
    util.getStorageCart('cart', 'id', 'count', this.data.product) // 把同类商品折合计数
    this.setData(this.data)
  },
  onTabItemTap: function() {
    util.getStorageCart('cart', 'id', 'count', this.data.product) // 把同类商品折合计数
    this.setData(this.data)
  },
  startPage: function(e) {
    // util.redirect('detail') // 不带参数打开页面
    // 页面跳转
    util.redirect({
      url: 'detail',
      product: e.currentTarget.dataset.item.product,
      logo: e.currentTarget.dataset.item.logo,
      price: e.currentTarget.dataset.item.price
    })
  }
})