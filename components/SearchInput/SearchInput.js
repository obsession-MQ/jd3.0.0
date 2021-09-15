// components/SearchInput/SearchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    Ishow: Boolean,
  },
  externalClasses: ['my-class'],
  /**
   * 组件的初始数据
   */
  data: {
    downp: [
      {
        id: 0,
        value: "首页",
        path: "/pages/index/index",
        icon: "icon-gouwudai",
      },
      {
        id: 1,
        value: "搜索",
        path: "/pages/search/search",
        icon: "icon-sousuoxuanzhong",
      },
      {
        id: 2,
        value: "购物车",
        path: "/pages/cart/cart",
        icon: "icon-gouwuche1",
      },
      {
        id: 3,
        value: "个人中心",
        path: "/pages/user/user",
        icon: "icon-gerenzhongxinxuanzhong",
      },
      {
        id: 4,
        value: "我的收藏",
        path: "/pages/index/index",
        icon: "icon-gouwudai",
      },
      {
        id: 5,
        value: "我的足迹",
        path: "/pages/index/index",
        icon: "icon-wodezuji",
      },
      {
        id: 6,
        value: "用户反馈",
        path: "/pages/feedback/feedback",
        icon: "icon-xingzhuang1kaobei3x",
      },
    ],
    Isflag: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 箭头返回上一页
    handleBack() {
      wx.navigateBack({
        delta: 1,
      });
    },
    // 控制显示与隐藏
    eduBulletFrame(e) {
      let isflag = this.data.Isflag;
      if (isflag == false) {
        this.setData({
          Isflag: true,
        });
      } else {
        this.setData({
          Isflag: false,
        });
      }
    },
    // 给最外层盒子加点击事件
    handledownp(e) {
      this.setData({
        Isflag: false,
      });
    },
  },
});
