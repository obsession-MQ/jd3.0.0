// pages/category/category.js
import { request } from "../../request/index";
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftdata: [],
    rightdata: [],
    // 被点击左侧菜单
    currentIndex: 0,
    scrollTop: 0,
  },
  // 接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  async getCates() {
    const res = await request({ url: "/api/goodType" });
    this.cate = res;
    console.log(this.Cates);
    // 接口存入本地存储
    let leftdata = this.cate.filter((v) => v.parent_id == 0);
    let rightdata = this.cate.filter(
      (v) => v.parent_id == leftdata[0].good_type_id
    );
    rightdata.map(
      (v) =>
        (v["children"] = this.cate.filter((j) => j.parent_id == v.good_type_id))
    );
    // setTimeout(() => {
      this.setData({
        leftdata,
        rightdata,
      });
    // }, 1000);
  },
  handleItemTap(e) {
    // console.log(e);
    let leftdata = this.data.leftdata;
    const { index } = e.currentTarget.dataset;
    let rightdata = this.cate.filter(
      (v) => v.parent_id == leftdata[index].good_type_id
    );
    rightdata.map(
      (v, ind) =>
        (v["children"] = this.cate.filter((j) => j.parent_id == v.good_type_id))
    );
    this.setData({
      currentIndex: index,
      rightdata,
      scrollTop: 0,
    });
  },
  onLoad: function (options) {
    // 先判断本地存储的数据无则请求 有返回
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCates();
    } else {
      // 有旧数据
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftdata = this.Cates.map((v) => v.cat_name);
        let rightdata = this.Cates[0].children;
        this.setData({
          leftdata,
          rightdata,
        });
      }
    }
  },
});
