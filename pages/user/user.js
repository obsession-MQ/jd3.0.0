// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    instrumentData: [
      {
        img: "/icon/one.png",
        text: "客服服务",
      },
      {
        img: "/icon/two.png",
        text: "寄件服务",
      },
      {
        img: "/icon/three.png",
        text: "我的预约",
      },
      {
        img: "/icon/four.png",
        text: "闲置换钱",
      },
      {
        img: "/icon/five.png",
        text: "我的爱车",
      },
      {
        img: "/icon/six.png",
        text: "高价回收",
      },
      {
        img: "/icon/seven.png",
        text: "我的礼物",
      },
      {
        img: "/icon/eight.png",
        text: "闪电退款S+",
      },
      {
        img: "/icon/nine.png",
        text: "特价机票",
      },
    ],
    shopingList: [
      {
        title: "商品收藏",
        num: 0,
      },
      {
        title: "店铺收藏",
        num: 5,
      },
      {
        title: "我的足迹",
        num: 0,
      },
    ],
    myAssetList: [
      {
        title: "优惠券",
        num: 4,
      },
      {
        title: "账号余额",
        num: 0,
      },
      {
        title: "京豆",
        num: 258,
      },
      {
        title: "红包",
        num: 1,
      },
    ],
    isLogin: false,
    nickName: "请登录/注册您的账号",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //设置按钮的跳转
  handleSetting() {
    wx.navigateTo({
      url: "/pages/setting/index",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  //跳转登录页面
  handleLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //跳转全部订单页面
  handleOrder() {
    wx.navigateTo({
      url: "/pages/order/index",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
  onShow: function () {
    let user = wx.getStorageSync("user");
    let nickName = user.nick_name;
    if (nickName) {
      this.setData({
        isLogin: true,
        nickName,
      });
    } else {
      this.setData({
        isLogin: false,
        nickName: "请登录/注册您的账号",
      });
    }
  },
});
