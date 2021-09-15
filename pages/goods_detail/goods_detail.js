// pages/goods_detail/goods_detail.js
import { request } from "../../request/index";
import regeneratorRuntime, { async } from "../../libs/runtime/runtime";
import { regionData } from "../../components/select/city";
let animationShowHeight = 300;
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CommImg: [
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqAeK.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
      "https://z3.ax1x.com/2021/08/22/hpqSJJ.jpg",
    ],
    GoodsList: [],
    imgList: [],
    goodsList: [],
    TitleList: [
      {
        id: 0,
        name: "商品",
      },
      {
        id: 1,
        name: "评价",
      },
      {
        id: 2,
        name: "详情",
      },
      {
        id: 3,
        name: "推荐",
      },
    ],
    // 城市
    city: {
      show: false,
      pageList: regionData,
      data: regionData,
      name: "city",
      value: "",
      selected: [],
      chinaed: [],
      index: 0,
      page: 0,
      quantity: 2,
      multipleChoice: false,
    },
    publicObj: {},
    // 商品详情列表
    goodsObj: {},
    // 存入数组
    GoodsInfo: [],
    // 选择后的checked数组
    checkde: [],
    // 添加购物车成功后数量
    isAdd: false,
    // sku值数组
    theSku: [],
    goodsNum: 1,
    isCollect: false,
    currentSwiper: 0,
    likeNumber: 0,
    show: true,
    // 模拟弹框选择
    showModalStatus: false,
    showAdres: false,
    showtips: false,
    // 背景滚动
    isScroll: true,
    // 动画效果c
    animationData: "",
    isTitle: 1,
    More: true,
    // 标签栏
    fixedInputPhone: false,
    top: 0,
    topTwo: 0,
    goTop: false,
    IsFlag: false,
    IsBack: false,
    dis: true,
    ShowCart: true,
  },
  QueryParms: {
    pagenum: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let CurrentPages = pages[pages.length - 1];
    let options = CurrentPages.options;
    const { good_id } = options;
    this.getgoodsObj(good_id);
    this.getshoppingCart();
    this.showAds();
    this.getGoodList();
    wx.getSystemInfo({
      success: (res) => {
        animationShowHeight = res.windowHeight;
      },
    });
  },
  // 获取商品详情数据并处理数据
  async getgoodsObj(good_id) {
    const goodsObj = await request({
      url: "/api/goodInfo",
      data: {
        good_id: good_id,
      },
    });
    console.log(goodsObj);
    this.data.GoodsInfo = goodsObj;
    try {
      goodsObj.good_name = JSON.parse(goodsObj.good_name);
    } catch (error) {
      goodsObj.good_name;
    }
    try {
      goodsObj.img = JSON.parse(goodsObj.img);
    } catch (error) {
      if (typeof goodsObj.img == "string") {
        if (goodsObj.img.includes(",")) {
          goodsObj.img = goodsObj.img.split(",");
        } else {
          let img = [];
          img.push(goodsObj.img);
          goodsObj.img = img;
        }
      }
    }
    goodsObj.info.map((itm) => {
      try {
        itm.colour = JSON.parse(JSON.parse(itm.colour));
        // console.log(1);
      } catch (error) {
        itm.colour;
        // console.log(2);
      }
      try {
        itm.edition = JSON.parse(JSON.parse(itm.edition));
        if (itm.edition != []) {
          itm.edition.specList.map((i) => {
            i.list = i.list.map((j) => {
              let a = j;
              return (j = {
                val: a,
                check: false,
              });
            });
            // console.log(i.list);
          });
        }
      } catch (error) {
        itm.edition;
      }
      try {
        itm.imgs = JSON.parse(itm.imgs);
        // console.log(typeof itm.imgs);
        if (typeof itm.imgs == "string") {
          itm.imgs = itm.imgs.split(",");
        }
      } catch (error) {
        itm.imgs;
      }
    });
    let that = goodsObj;
    this.setData({
      goodsObj: that,
    });
    // console.log(this.data.goodsObj);
  },
  // 获取购物车列表
  async getshoppingCart() {
    let token = wx.getStorageSync("token");
    let res = await request({
      url: "/api/shoppingCarList",
      data: {
        token: token,
      },
    });
    this.setData({
      goodNum: res.count,
    });
    // console.log(res.count);
  },
  // 点击加入购物车
  async handleCardAdd(e) {
    const { cart } = e.currentTarget.dataset;
    if (cart === 1) {
      let checkeds = true;
      let that = this.data.goodsObj;
      let flag = "";
      that.info.map((value) => {
        for (const val of value.edition.specList) {
          let flags = val.list.some((item) => {
            return item.check == true;
          });
          if (!flags) {
            flag = val.titel;
            checkeds = flags;
            break;
          }
        }
      });
      if (!checkeds) {
        wx.showToast({
          title: "请选择" + flag,
          icon: "success",
          duration: 1500,
          mask: true,
        });
      } else {
        let goodsInfo = this.data.GoodsInfo;
        // console.log(goodsInfo);
        let id = this.data.goodsObj.good_id;
        let money = this.data.goodsNum * Number(this.data.goodsObj.price);
        let skus = JSON.stringify(this.data.theSku);
        // console.log(id, money, skus);
        if (goodsInfo.length !== 0) {
          let res = await request({
            url: "/api/shoppingCarAddModify",
            data: {
              token: wx.getStorageSync("token"),
              good_id: id,
              num: this.data.goodsNum,
              price: this.data.goodsObj.price,
              money: money,
              sku: skus,
            },
          });
          // console.log(res.data);
          this.getshoppingCart();
          this.setData({
            showModalStatus: false,
            isScroll: true,
          });
        } else {
          let isIn = false;
          for (const param of goodsInfo) {
            let skuss = param.sku;
            if (param.good_id === id && skuss == skus) {
              isIn = true;
              let nums = param.num - 0 + (this.data.goodsNum - 0);
              let token = wx.getStorageSync("token");
              let res = await request({
                url: "/api/shoppingCarAddModify",
                data: {
                  token: token,
                  good_id: id,
                  num: nums,
                  price: this.data.goodsObj.price,
                  money: money,
                  sku: skus,
                  shopping_car_id: param.shopping_car_id,
                },
              });
              // console.log(res);
              this.getshoppingCart();
              break;
            }
          }
          if (!isIn) {
            let token = wx.getStorageSync("token");
            let res = await request({
              url: "/api/shoppingCarAddModify",
              data: {
                token: token,
                good_id: id,
                num: this.data.goodsNum,
                price: this.data.goodsObj.price,
                money: money,
                sku: skus,
              },
            });
            // console.log(res);
            this.getshoppingCart();
          }
        }
        wx.showToast({
          title: "加入成功",
          icon: "success",
          duration: 1500,
          mask: true,
        });
        this.setData({
          isAdd: true,
          isScroll: true,
        });
        setTimeout(() => {
          this.setData({
            isAdd: false,
            isScroll: true,
          });
        }, 1500);
      }
    } else {
      let checkeds = true;
      let that = this.data.goodsObj;
      let flag = "";
      that.info.map((value) => {
        for (const val of value.edition.specList) {
          let flags = val.list.some((item) => {
            return item.check == true;
          });
          if (!flags) {
            flag = val.titel;
            checkeds = flags;
            break;
          }
        }
      });
      if (!checkeds) {
        wx.showToast({
          title: "请选择" + flag,
          icon: "success",
          duration: 1500,
          mask: true,
        });
      } else {
        let goodsInfo = this.data.GoodsInfo;
        // console.log(goodsInfo);
        let id = this.data.goodsObj.good_id;
        let money = this.data.goodsNum *  Number(this.data.goodsObj.price);
        let skus = JSON.stringify(this.data.theSku);
        // console.log(id, money, skus);
        if (goodsInfo.length !== 0) {
          let res = await request({
            url: "/api/shoppingCarAddModify",
            data: {
              token: wx.getStorageSync("token"),
              good_id: id,
              num: this.data.goodsNum,
              price: this.data.goodsObj.price,
              money: money,
              sku: skus,
            },
          });
          // console.log(res);
          this.getshoppingCart();
          this.setData({
            showModalStatus: false,
          });
        } else {
          let isIn = false;
          for (const param of goodsInfo) {
            let skuss = param.sku;
            if (param.good_id === id && skuss == skus) {
              isIn = true;
              let nums = param.num - 0 + (this.data.goodsNum - 0);
              let token = wx.getStorageSync("token");
              let res = await request({
                url: "/api/shoppingCarAddModify",
                data: {
                  token: token,
                  good_id: id,
                  num: nums,
                  price: this.data.goodsObj.price,
                  money: money,
                  sku: skus,
                  shopping_car_id: param.shopping_car_id,
                },
              });
              // console.log(res);
              this.getshoppingCart();
              break;
            }
          }
          if (!isIn) {
            let token = wx.getStorageSync("token");
            let res = await request({
              url: "/api/shoppingCarAddModify",
              data: {
                token: token,
                good_id: id,
                num: this.data.goodsNum,
                price: this.data.goodsObj.price,
                money: money,
                sku: skus,
              },
            });
            // console.log(res);
            this.getshoppingCart();
          }
        }
        wx.showToast({
          title: "加入成功",
          icon: "success",
          duration: 1500,
          mask: true,
        });
        this.setData({
          isAdd: true,
          isScroll: true,
        });
        setTimeout(() => {
          this.setData({
            isAdd: false,
            isScroll: true,
          });
        }, 1500);
      }
    }
  },
  // 商品列表数据
  async getGoodList() {
    let res = await request({
      url: "/api/goodList",
      data: {
        is_new: 1,
      },
    });
    // console.log(res.data);
    res.data.map((item) => {
      try {
        item.good_name = JSON.parse(item.good_name);
      } catch (err) {
        if (typeof item.good_name == "string") {
          let name = {};
          name.name = item.good_name;
          item.good_name = name;
        }
      }
      try {
        item.img = JSON.parse(item.img);
        if (typeof item.img == "string") {
          if (item.img.includes(",")) {
            item.img = item.img.split(",");
          } else {
            let img = [];
            img.push(item.img);
            item.img = img;
          }
        }
      } catch (err) {
        if (typeof item.img == "string") {
          if (item.img.includes(",")) {
            item.img = item.img.split(",");
          } else {
            let img = [];
            img.push(item.img);
            item.img = img;
          }
        }
      }
    });
    // let that = res.data.data.data
    let that = this.group(res.data, 6);
    // console.log(that)
    this.setData({
      GoodsList: that,
    });
    // console.log(this.data.GoodsList);
  },
  async getCoodsList() {
    const res = await request({
      url: "/api/goodList",
      data:{
        page:this.QueryParms.pagenum
      }
    });
    this.setData({
      totalNum:res.count
    })
    res.data.map((item)=>{
      try{
        item.good_name = JSON.parse(item.good_name).name;
        item.img = JSON.parse(item.img)[0];
        // console.log(item.img);
      }catch(err){
        // console.log(item.img.indexOf('['));
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
  likeNumberChange(e) {
    this.setData({
      likeNumber: e.detail.current,
    });
  },
  group(array, _length) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
      newArray.push(array.slice(index, (index += _length)));
    }
    return newArray;
  },
  // 点击输入框弹出地址选择框
  cityFocus() {
    this.setData({
      "city.show": true,
      IsBack: true,
      dis: true,
    });
  },
  choiceback() {
    if (this.data.IsBack === false) {
      this.setData({
        dis: true,
      });
    } else {
      this.setData({
        dis: false,
        IsBack: false,
      });
    }
  },
  //通过事件接收子组件传过来的参数
  city: function (event) {
    let list = [];
    let selected = event.detail;
    for (let i = 0; i < selected.length; i++) {
      if (i == selected.length - 1) {
        list += selected[i].select;
      } else {
        // 选择之后加一个-
        list += selected[i].select;
      }
    }
    let address = selected.map((v) => v.select);
    wx.setStorageSync("add", address.join(""));
    wx.showLoading({
      title: "",
      success: (res) => {
        this.onShow();
        this.setData({
          showAdres: false,
        });
      },
    });
    this.setData({
      "city.selected": selected,
      "city.value": list,
    });
  },
  // 获取地址列表
  async GetAddressList() {
    const Address = await request({
      url: "/api/userAddressList",
      data: {
        token: wx.getStorageSync("token"),
      },
    });
    this.setData({
      GetAddressList: Address,
    });
  },
  // handleCard(){
  //   wx.switchTab({
  //     url: '/pages/cart/cart',
  //     success:(e)=>{
  //       var page = getCurrentPages().pop();
  //       if(page == undefined||page==null) return;
  //       page.onLoad();
  //     }
  //   })
  // },
  // 选择地址赋值到页面
  handleAddress(e) {
    // console.log(e);
    let { name, id } = e.currentTarget.dataset;
    // console.log(id);
    wx.showLoading({
      success: (res) => {
        wx.setStorageSync("add", name);
        wx.setStorageSync("id", id);
        this.onShow();
        this.setData({
          detailed: id,
        });
      },
    });
    setTimeout(() => {
      this.setData({
        showAdres: false,
      });
    }, 400);
    wx.hideLoading();
  },
  // 判断缓存是否存在地址
  showAds() {
    let isaddress = wx.getStorageSync("add") || [];
    this.setData({
      isaddress,
    });
  },
  // 循环遍历规格参数
  handleChecked(e) {
    let a = e.currentTarget.dataset.index;
    let b = e.currentTarget.dataset.titel;
    // console.log(a, b);
    let thats = this.data.goodsObj;
    let check = this.data.checkde;
    thats.info.map((item) => {
      item.edition.specList.map((itm) => {
        if (itm.titel == b) {
          itm.list.map((i) => {
            return (i.check = false);
          });
          itm.list[a].check = true;
          if (check.length > 0) {
            let flage = false;
            check.forEach((element) => {
              if (element.titel == itm.titel) {
                flage = true;
                element.val = itm.list[a].val;
              }
            });
            if (!flage) {
              check.push({
                titel: itm.titel,
                val: itm.list[a].val,
              });
            }
          } else {
            check.push({
              titel: itm.titel,
              val: itm.list[a].val,
            });
          }
          let intersection = item.edition.skuList.filter((value) => {
            var state = true;
            for (const item of check) {
              let a = value.specs.includes(item.val);
              // console.log(a, 15858, item.val);
              if (!a) {
                state = false;
                break;
              }
            }
            if (state) {
              return value;
            }
          });
          if (intersection.length == 1) {
            if (intersection[0].specs[2] == 0) {
              check = [];
              wx.showToast({
                title: "缺货，请重新选择",
                // image: "/img/cuowu.svg",
                duration: 1500,
                mask: true,
              });
              for (const iterator of item.edition.specList) {
                for (const itera of iterator.list) {
                  itera.check = false;
                }
              }
            } else {
              let prices = this.data.goodsObj;
              prices.price = intersection[0].specs[3];
              this.setData({
                theSku: intersection,
                goodsObj: prices,
              });
              // console.log(this.data.theSku, 25852828528);
            }
          }
        }
      });
    });
    this.setData({
      goodsObj: thats,
      checkde: check,
    });
    // console.log(this.data.checkde);
  },
  // 放大图片
  handlePreviewImage(e) {
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: this.data.goodsObj.img,
      current,
    });
  },
  // 单张图片放大
  preview(e) {
    let currentUrl = e.currentTarget.dataset.src;
    let firstImg = this.data.goodsObj.img;
    wx.previewImage({
      current: currentUrl,
      urls: firstImg,
    });
  },
  // 评论去图片放大预览
  handlePreviewImageComm(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
    });
  },
  // 滚动图片数字改变
  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current,
    });
  },
  // 数量改变
  handleNum(e) {
    let a = e.currentTarget.dataset.num - 0;
    let thats = this.data.goodsNum - 0;
    thats += a;
    if (thats <= 0) {
      thats = 1;
    }
    this.setData({
      goodsNum: thats,
    });
  },
  handleInputNum(e) {
    const num = e.detail.value;
    if (num === 0 && num <= 200) {
      wx.showToast({
        title: "单款最多可买200件",
        success: (res) => {
          this.setData({
            goodsNum: 1,
          });
        },
      });
    } else {
      this.setData({
        goodsNum: num,
      });
    }
  },
  // 点击商品图标收藏
  handleCollect() {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否被收藏
    let index = collect.findIndex((v) => v.good_id === this.GoodsInfo.good_id);
    // 3.当index！==-1 表示已收藏
    if (index !== -1) {
      // 找到则收藏 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        mask: true,
      });
    } else {
      // 反之
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      });
    }
    // 4.数组存入缓存
    wx.setStorageSync("collect", collect);
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect,
    });
  },
  handlechange(e) {
    const es = e.detail;
    this.setData({
      es: false,
    });
  },
  // 给最外层盒子加点击事件 商品参数
  handledownp(e) {
    // 显示遮罩层
    const { operation } = e.currentTarget.dataset;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "linear",
      delay: 0,
    });
    this.animation = animation;
    animation.translateY(animationShowHeight).step();
    if (operation === 1) {
      this.setData({
        animationData: animation.export(),
        showModalStatus: true,
        isScroll: false,
        ShowCart: true,
      });
    } else if (operation === 2) {
      this.setData({
        animationData: animation.export(),
        showAdres: true,
        isScroll: false,
        dis: false,
      });
    } else if (operation === 3) {
      this.setData({
        animationData: animation.export(),
        showtips: true,
        isScroll: false,
      });
    } else if (operation === 4) {
      this.setData({
        animationData: animation.export(),
        showModalStatus: true,
        isScroll: false,
        ShowCart: false,
      });
    } else {
      this.setData({
        animationData: animation.export(),
        showModalStatus: true,
        isScroll: false,
        ShowCart: false,
      });
    }
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
        });
      }.bind(this),
      0
    );
  },
  // 隐藏遮罩层
  hideModal(e) {
    const { operation } = e.currentTarget.dataset;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
    });
    this.animation = animation;
    animation.translateY(animationShowHeight).step();
    if (operation === 1) {
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        isScroll: true,
      });
    } else if (operation === 2) {
      this.setData({
        animationData: animation.export(),
        showAdres: false,
        isScroll: true,
        dis: false,
      });
    } else if (operation === 3) {
      this.setData({
        animationData: animation.export(),
        showtips: false,
        isScroll: true,
      });
    } else {
      this.setData({
        animationData: animation.export(),
        showtips: false,
        isScroll: true,
      });
    }
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
          showModalStatus: false,
        });
      }.bind(this),
      0
    );
  },
  // 取消隐藏按钮
  cancel(e) {
    const { operation } = e.currentTarget.dataset;
    if (operation === 1) {
      this.setData({
        showModalStatus: !this.data.showModalStatus,
        isScroll: true,
      });
    } else if (operation === 2) {
      this.setData({
        showAdres: !this.data.showAdres,
        isScroll: true,
      });
    } else {
      this.setData({
        showtips: !this.data.showtips,
        isScroll: true,
      });
    }
  },
  handleItemTap(e) {
    let mo = !this.data.More;
    this.setData({
      isTitle: e.currentTarget.dataset.num,
      More: mo,
    });
  },
  onLoad() {
    this.getCoodsList();
    this.GetAddressList();
    var that = this;
    //设置商品列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // height:1140
          height: res.windowHeight * 2 - 60,
        });
      },
    });
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc,
        });
      },
    });
    var query = wx.createSelectorQuery();
    //获取板块一离顶部的距离
    // query.select('#block1').boundingClientRect(function (res) {
    //   that.setData({
    //     block1_top: res.top
    //   })
    // }).exec()
    //获取板块二离顶部的距离
    query
      .select("#block2")
      .boundingClientRect(function (res) {
        that.setData({
          block2_top: res.topTwo,
        });
      })
      .exec();
    //获取板块三离顶部的距离
    query
      .select("#block3")
      .boundingClientRect(function (res) {
        that.setData({
          block3_top: res.topTwo,
        });
      })
      .exec();
  },
  handleTitle(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index,
    });
  },
  onPageScroll(e) {
    if (e.detail.scrollTop > 150) {
      this.setData({
        fixedInputPhone: true,
        goTop: true,
        IsFlag: true,
      });
    } else {
      this.setData({
        fixedInputPhone: false,
        goTop: false,
        IsFlag: false,
      });
    }
  },
  goTop: function () {
    // 点击回到顶部
    this.setData({
      top: 0, // 用this.setData 才能实时更新界面
    });
  },
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
});
