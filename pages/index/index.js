/*
 * @Author: your name
 * @Date: 2021-08-20 11:19:02
 * @LastEditTime: 2021-08-30 15:30:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jd1.0.0\pages\index\index.js
 */
// 引入
import { request } from "../../request/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shouter: 0,
    currentIndex: 0,
    userInfo: {},
    user: {},
    homeGoodList: [],
    // 轮播图数组
    swiperlist: [],
    catelist: [],
    floorlist: [],
    goodList: [],
    bannerList: [],
    subscript1: false,
    shade: false,
    user: [],
    lube: [
      {
        id: "0",
        text: "京东超市",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/175540/24/19329/6842/60ec0b0aEf35f7384/ec560dbf9b82b90b.png!q70.jpg.dpg",
      },
      {
        id: "1",
        text: "京东电器",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/178015/31/13828/6862/60ec0c04Ee2fd63ac/ccf74d805a059a44.png!q70.jpg.dpg",
      },
      {
        id: "2",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/41867/2/15966/7116/60ec0e0dE9f50d596/758babcb4f911bf4.png!q70.jpg.dpg",
        text: "京东服饰",
      },
      {
        id: "3",
        text: "京东生鲜",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/177902/16/13776/5658/60ec0e71E801087f2/a0d5a68bf1461e6d.png!q70.jpg.dpg",
      },
      {
        id: "4",
        text: "京东到家",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/196472/7/12807/7127/60ec0ea3Efe11835b/37c65625d94cae75.png!q70.jpg.dpg",
      },
      {
        id: "5",
        text: "充值缴费",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/185733/21/13527/6648/60ec0f31E0fea3e0a/d86d463521140bb6.png!q70.jpg.dpg",
      },
      {
        id: "6",
        text: "9.9元拼",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/36069/14/16068/6465/60ec0f67E155f9488/595ff3e606a53f02.png!q70.jpg.dpg",
      },
      {
        id: "7",
        text: "领劵",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/186080/16/13681/8175/60ec0fcdE032af6cf/c5acd2f8454c40e1.png!q70.jpg.dpg",
      },
      {
        id: "8",
        text: "领金贴",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/196711/35/12751/6996/60ec1000E21b5bab4/38077313cb9eac4b.png!q70.jpg.dpg",
      },
      {
        id: "9",
        text: "PLUS会员",
        pick: "https://m.360buyimg.com/mobilecms/s120x120_jfs/t1/37709/6/15279/6118/60ec1046E4b5592c6/a7d6b66354efb141.png!q70.jpg.dpg",
      },
      {
        id: 1,
        pic: "赵四",
      },
      {
        id: 2,
        pic: "赵五",
      },
      {
        id: 3,
        pic: "赵二",
      },
    ],
    shouted: [
      { id: "1", text: "首页" },
      { id: "2", text: "腕表珠宝" },
      { id: "3", text: "大家电" },
      { id: "4", text: "数码" },
      { id: "5", text: "手机" },
      { id: "6", text: "医药健康" },
      { id: "7", text: "小家电" },
      { id: "8", text: "奢侈品" },
      { id: "9", text: "酒水" },
      { id: "10", text: "食品饮料" },
      { id: "11", text: "箱包皮具" },
      { id: "12", text: "男装" },
      { id: "13", text: "女装" },
      { id: "14", text: "女鞋" },
      { id: "15", text: "母婴" },
      { id: "16", text: "图书" },
      { id: "17", text: "生鲜" },
      { id: "18", text: "运动" },
      { id: "19", text: "爱车" },
      { id: "20", text: "内衣配饰" },
      { id: "21", text: "个护清洁" },
    ],
    goodType: [],
    goodInfo: [],
    QueryParams: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.goodslist();
    // ! banner 轮播图列表
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/bannerList", //!表示请求哪里的数据

      success: (result) => {
        // console.log(result);
        this.setData({
          bannerList: result.data.data,
        });
      },
    });

    // ! banner列表
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/admin/goodInfo", //!表示请求哪里的数据
      success: (result) => {
        // console.log(result);
        this.setData({
          goodInfo: result.data.data,
        });
      },
    });

    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/promotionTypeList", //!表示请求哪里的数据

      success: (result) => {
        // console.log(result);
        this.setData({
          goodType: result.data.data,
        });
      },
    });
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList", //!表示请求哪里的数据
      method: "POST",
      data: {
        size: "500",
      },
      page: "5",
      header: {
        "content-type": "application/json",
      },
      success: (result) => {
        // console.log(result);
        let b = [];
        result.data.data.data.forEach((ele) => {
          try {
            let a = JSON.parse(ele.good_name); //!名字
            // console.log(a.id);
            let c = JSON.parse(ele.img); //! 图片
            // let d = JSON.parse(ele.good_name).name;
            // console.log(d);
            if (a.id == "candyLee") {
              ele.good_name = a.name;
              console.log(ele.good_name);
              console.log(ele.good_name);
              ele.img = c[0];
              b.push(ele);
            } else if (a.id == "lcwll") {
              ele.good_name = a.name;
              console.log();
              ele.img = c[0];
              b.push(ele);
            }
          } catch (err) {
            ele.img = ele.img;
          }
        });
        // console.log(b);
        this.setData({
          goodList: b,
          // goodList: [...this.data.goodList],
        });
        wx.setStorageSync("list", this.data.goodList);
        wx.stopPullDownRefresh();
      },
    });

    //获取轮播图数据

    wx.request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata", //!表示请求哪里的数据

      success: (result) => {
        // console.log(result);

        this.setData({
          swiperlist: result.data.message,
        });
      },
    });

    wx.request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems", //!表示请求哪里的数据

      success: (result) => {
        // console.log(result);

        this.setData({
          catelist: result.data.message,
        });
      },
    });

    wx.request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata", //!表示请求哪里的数据
      success: (result) => {
        // console.log(result);
        this.setData({
          floorlist: result.data.message,
        });
      },
    });
  },
  handleItemTap(e) {
    this.data.currentIndex = e.currentTarget.dataset.id;
    // console.log(this.data.currentIndex);
    this.setData({
      currentIndex: this.data.currentIndex,
    });
  },

  shouters(v) {
    // console.log(v);
    this.data.shouter = v.currentTarget.dataset.id;
    this.setData({
      shouter: this.data.shouter,
    });
  },

  subscript() {
    this.setData({
      subscript1: !this.data.subscript1,
    });
  },
  shade() {
    this.setData({
      subscript1: this.data.shade,
    });
  },

  async getCates() {
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 接口存入本地存储
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   if (this.QueryParms.pagenum >= this.totalPages) {
  //     wx -
  //       wx.showToast({
  //         title: "我的有底线的",
  //       });
  //   } else {
  //     this.QueryParms.pagenum++;
  //     this.getCoodsList();
  //   }
  // },

});
