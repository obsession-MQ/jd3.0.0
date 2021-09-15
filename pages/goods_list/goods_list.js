// pages/goods_list/goods_list.js
import { request } from "../../request/index";
import regeneratorRuntime from "../../libs/runtime/runtime";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    GetAddressList:'',
    flexdFlag:false,
    scrollTop:null,
    showSort:false,
    changeStyleFlag:true,
    filterFlag:false,
    address:"请选择地址",
    isScroll:true,
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
        children:["综合","最新上架","评价最多"]
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
      {
        id: 3,
        value: "小时达",
        isActive: false,
      },
    ],
    imgList:[],
    goodsList: [],
    CategoryList: [{
      con: '京东物流',
      isChecked: false
    },
    {
      con: '有货优先',
      isChecked: false
    },
    {
      con: '货到付款',
      isChecked: false
    },
    {
      con: '211限时达',
      isChecked: false
    },
    {
      con: '新品',
      isChecked: false
    },
    {
      con: '京东国际',
      isChecked: false
    },
    {
      con: 'PLUS专享',
      isChecked: false
    },
    {
      con: '促销商品',
      isChecked: false
    },
    {
      con: '拍拍二手',
      isChecked: false
    }
  ],
  },
  QueryParms: {
    pagenum: 1,
  },

  //返回商品列表
  handleBack(){
    wx.navigateBack({
      delta: 1,
    })
  },
//关闭弹窗
  onHidePupopTap(event){
    this.setData({
      filterFlag:event.detail
    })
  },
  onPageScroll(e){
    this.setData({
      scrollTop:e.scrollTop
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad(options) {
    this.QueryParms.cid = options.cid || "";
    this.QueryParms.query = options.query || "";
    this.getCoodsList();
    if(wx.getStorageSync("add")){
      this.setData({
        address:wx.getStorageSync("add")
      })
    }else{
      this.setData({
        address:wx.setStorageSync("add","请选择地址")
      })
    }
    this.onShow();
  },
   
  // 获取数据
  async getCoodsList() {
    const res = await request({
      url: "/api/goodList",
      data:{
        page:this.QueryParms.pagenum
      }
    });
    console.log(res);
    this.setData({
      totalNum:res.count
    })
    res.data.map((item)=>{
      try{
        item.good_name = JSON.parse(item.good_name).name;
        item.img = JSON.parse(item.img)[0];
      }catch(err){
        console.log(item.img.indexOf('['));
        if(item.img.indexOf('[')!=-1){
          item.img = item.img.replaceAll('[',''); 
          item.img = item.img.replaceAll(']','');
          item.img = item.img.replaceAll('"','');
          if(item.img.indexOf(',')!=-1){
            item.img = item.img.slice(0,item.img.indexOf(','));
          }else{
            item.img.slice(0,item.img.indexOf(',')+1);
          }
          
        }else{
          item.img = item.img.replaceAll('"','');
        }
        this.data.imgList.push(item.img);
      }
    });
    this.setData({
      goodsList: [...this.data.goodsList, ...res.data],
      imgList:this.data.imgList
    });
    // 关闭下拉
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData();
  },

  //同步选择标签
  hanldeChoose(e){
    console.log(e.detail);
    this.setData({
      CategoryList:e.detail
    })
    this.setData({
      changeOrange : this.data.CategoryList.some((item)=>{
        return item.isChecked==true;
      })
    })
  },
  //点击标签高亮
  onChecked(e){
    const index = e.currentTarget.dataset.id;
    let {CategoryList}  = this.data;
    CategoryList.forEach((v, i) =>{
      if (i === index) {
        v.isChecked = !v.isChecked;
      }
    });
    this.setData({
      changeOrange : this.data.CategoryList.some((item)=>{
        return item.isChecked==true;
      })
    })
    this.setData({
      CategoryList,
    });
  },
  // 点击排序方式高亮
  hanldeChange(e) {
    this.data.showSort = false;
    console.log(e.detail);
    let { index } = e.detail;
    let { upFlag } = e.detail;
    let { tabs } = this.data;
    console.log(upFlag);
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs,
    });
    if(index === 2){
      let tempList =[...this.data.goodsList];
      for(let i=1;i<tempList.length;i++){
        const goodsPrice = Number(tempList[i].price);
        for(let j=0;j<tempList.length-1;j++){
          const goods1Price = Number(tempList[j].price);
          if(upFlag){
            if(goodsPrice<goods1Price){
              let temp = {};
              temp = tempList[i];
              tempList[i]= tempList[j];
              tempList[j] = temp;
            }
          }else{
            if(goodsPrice>goods1Price){
              let temp = {};
              temp = tempList[i];
              tempList[i]= tempList[j];
              tempList[j] = temp;
            }
          }
        }
      }
      console.log(tempList);
      // this.data.goodsList = tempList;
      this.setData({
        goodsList:tempList
      })
    }
  },
  //打开筛选侧边栏
  filter(){
    this.setData({
      filterFlag:true,
      hiddenFlag:true,
      isScroll:!this.data.isScroll
    })
  },
  //接收子组件传来的选择数据，动态渲染tabs的选择情况
  checkedOn(event){
    this.data.tabs[0].value = event.detail;
    const {tabs}  = this.data;
    this.setData({
      tabs,
    })
  },
  //为tabs添加样式
  changeStyle(event){
    console.log(event);
    this.setData({
      changeStyleFlag:event.detail
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      goodsList: [],
    });
    this.QueryParms.pagenum=1;
    this.getCoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.goodsList.length >= this.data.totalNum) {
     wx.showToast({
          title: "我的有底线的",
        });
    } else {
      this.QueryParms.pagenum++;
      this.getCoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
