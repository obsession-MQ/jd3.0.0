import { request } from "./request/index";
wx-App({
  globalData: {
    flag:false
   },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },
  // {
  //   "pagePath": "pages/cart/cart",
  //   "text": "购物车",
  //   "iconPath": "icons/cart.png",
  //   "selectedIconPath": "icons/cart-o.png"
  // },
  //   {
  //   "pagePath": "pages/user/user",
  //   "text": "我的",
  //   "iconPath": "icons/my.png",
  //   "selectedIconPath": "icons/my-o.png"
  // }
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
