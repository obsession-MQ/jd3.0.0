/*
 * @Author: your name
 * @Date: 2021-08-28 11:02:09
 * @LastEditTime: 2021-08-28 16:48:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jd1.1.0\pages\orders\orders.js
 */
// pages/orders/orders.js
import { request } from "../../request/index";
import regeneratorRuntime, { async } from "../../libs/runtime/runtime";

Page({
  data: {
    goodList: [],
    current: 0,
    curr: "",
    currentIndex: 0,
    subscript1: false,
    isShow:false,
    complete: [
      { id: "0", txt: "全部" },
      { id: "1", txt: "待付款" },
      { id: "2", txt: "待收货" },
      { id: "3", txt: "待评价" },
    ],
    shouted: [
      { id: "1", text: "我的拼购" },
      { id: "2", text: "筹款" },
      { id: "3", text: "订单回收站" },
      { id: "4", text: "京东到家" }
    ],
  },
  complex(e) {
    this.data.current = e.currentTarget.dataset.id;
    this.setData({
      currentIndex: this.data.current,
      isShow:!this.data.isShow
    });
    this.orderlist();
  },
  onLoad: function (options) {
    this.goodList();
    this.orderlist();
  },
  subscript() {
    this.setData({
      subscript1: !this.data.subscript1,
    });
  },
  async goodList() {
    const res = await request({
      url: "/api/goodList",
      data: {
        size: "500",
      },
    });
    res.data.forEach((ele) => {
      try {
        let a = JSON.parse(ele.good_name); //!名字
        let c = JSON.parse(ele.img); //! 图片
      } catch (err) {
        ele.good_name, ele.img;
      }
      let that = res.data;
      this.setData({
        goodList: that,
      });
    });
    wx.setStorageSync("list", this.data.goodList);
    wx.stopPullDownRefresh();
  },
  // 获取订单数据
  async orderlist() {
    const res = await request({
      url: "/api/orderList",
      data: {
        token: wx.getStorageSync("token"),
        status:this.data.currentIndex
      },
    });
    if (res.data.length != 0) {
      // 现在时间
      let now = Date.parse(new Date());
      let orderList = res.data;
      for (var i = 0; i < orderList.length; i++) {
        const element = orderList[i];
        // 将获取到的时间加15分钟
        element.time = element.delivery_time *1000+900000;
        // 如果现在时间大于增加之后的时间就证明在15分钟之内
        // 不然则反之
        if (element.time<now) {
          element.state = "待收货"
        }else {
          element.state = "待付款"
        }
        // 生成剩余时间 再加进数组对象中
        let minute, second,timeRemaining;
        timeRemaining= element.time-now;
        second = Math.floor(timeRemaining / 1000 % 60);
        minute = Math.floor(timeRemaining / 1000 / 60 % 60);
        // console.log(minute + '分' + second + '秒');
        element.time= minute + '分' + second + '秒';
        if (element.childern) {
          for (let j = 0; j < element.childern.length; j++) {
            const ele = element.childern[j];
            ele.sku = JSON.parse(ele.sku);
            ele.good_name = JSON.parse(ele.good_name)
          }
        }
      }
      this.setData({
        orderList
      })
      console.log(this.data.orderList);
    }
  },
  shouters(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.id);
    this.data.currentIndex = e.currentTarget.dataset.id;
    // console.log(this.data.currentIndex);
    this.setData({
      curr: this.data.currentIndex,
    });
  },
  //再次购买
  Rebuy(e){
    const item = e.currentTarget.dataset.item;
    // const itemjson = JSON.parse(item);
    console.log(item);
    wx.navigateTo({
      url: '/pages/pay/pay?orderList='+JSON.stringify(item)+'&totalPrice='+item.money,
    })
  }
});
