//获取购物车列表
// pages/cart1/cart1.js
import {
  request
} from "../../request/index";
import regeneratorRuntime from "../../libs/runtime/runtime";
import {showToast} from "../../utils/asyncwx";
let animationShowHeight = 300;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    payarr: [],
    address: {},
    cart: [],
    imgList: [],
    // 商品详情列表
    goodsObj: {},
    // 存入数组
    GoodsInfo: [],
    GetAddressList: "",
    istrue: false,
    animationData: {},
    allchecked: false,
    totalPrice: 0,
    totalNum: 0,
    miunsStatus: "disabled",
    iscompile: true,
    isfoot: true,
    isshow: false,
    // 背景滚动
    isScroll: true,
    addlength: "",
    showModalStatus: false,
    // 选择后的checked数组
    checkde: [],
  },
  // 获取地址的点击事件
  GetAddress() {
    this.onShow();
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/userAddressList",
      data: {
        token: wx.getStorageSync("token"),
      },
      success: (result) => {
        console.log(result);
      },
      fail: (res) => {
        console.log(res);
      },
    });
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: "linear",
    });
    // 将该变量赋值给当前动画
    that.animation = animation;
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step();
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      istrue: true,
    });
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step();
      that.setData({
        animationData: animation.export(),
      });
    }, 200);
  },
  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let {
      cart,
      allchecked
    } = this.data;
    // 2 修改值
    allchecked = !allchecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach((v) => (v.checked = allchecked));
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品的选中
  handeItemChange(e) {
    console.log(e.currentTarget.dataset);
    const data = e.currentTarget.dataset;
    // 1 获取被修改的商品的car_id
    const car_id = data.id;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.shopping_car_id == car_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
    console.log(this.data.payarr);

  },
  // fomatFloat(src, pos) {
  //   return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
  // },
  // 设置购物车状态同时  重新计算 底部工具栏的数据  全选  总价格  购买的数量
  setCart(cart) {
    let allchecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        console.log(v.money);
        let money1 = Number(v.money);
        money1 = v.num * Number(v.price);
        totalPrice += money1;
        totalNum += v.num;
      } else {
        allchecked = false;
      }
    });
    // 判断数组是否为空
    allchecked = cart.length != 0 ? allchecked : false;
    this.setData({
      cart,
      allchecked,
      totalPrice,
      totalNum,
    });
    wx.setStorageSync('cart', this.data.cart)
  },
  //增加商品的数量
  addnum(e) { 
    let token = wx.getStorageSync("token");
    this.data.cart.map(v=>{
      console.log(v);
      console.log(v.good_id);
      // console.log(v.num);
      let num = v.num+1;
      console.log(v.sku);
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/shoppingCarAddModify",
        method:"POST",
        data: {
          token: token,
          good_id: v.good_id,
          num: num,
          price: v.price,
          money: v.money,
          sku: v.sku,
          shopping_car_id:v.shopping_car_id
        },
        success:(res)=>{
        console.log(res);
        },
      });
      wx.showLoading({
        title: '',
        mask:'true'
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 500);
    })
    let index = e.currentTarget.dataset.index;
    let cart = this.data.cart;
    cart[index].num++;
    // this.setData({
    //   cart
    // });
    this.setCart(cart);
    // this.getdata();
  },
  //减少商品的数量
  reducenum(e) {
    this.data.cart.map(v=>{
      console.log(v); 
      wx.request({
        url: "/api/shoppingCarAddModify",
        data: {
          token: wx.getStorageSync("token"),
          good_id: v.id,
          num: v.num,
          price: v.price,
          money: v.money,
          sku: v.sku,
          shopping_car_id:v.shopping_car_id
        },
        success:(res)=>{
        },
      });
      wx.showLoading({
        title: '',
        mask:'true'
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 500);
    })
    let index = e.currentTarget.dataset.index;
    let cart = this.data.cart;
    if (cart[index].num > 1) {
      cart[index].num--;
      this.setData({
        cart: cart,
      });
    }
    let minusStatus = cart[index].num <= 1 ? "disabled" : "normal";
    this.setData({
      minusStatus: minusStatus,
    });
    this.setCart(cart);
  },
  //输入框事件
  bindManual(e) {
    let index = e.currentTarget.dataset.index;
    let cart = this.data.cart;
    let num = e.detail.value - 0;
    cart[index].num = num;
    this.setData({
      num: num,
    });
    this.setCart(cart);
  },
  //从缓存获取地址
  showAds() {
    let address = wx.getStorageSync("add");
    if(address.length){
      console.log(address[0]);
      this.setData({
        isaddress:address[0].detailed
      });
    }else{
      console.log(address);
      this.setData({
        isaddress:address.detailed
      });
    }

  },
  // 获取购物车列表数据
  async getdata() {
    const res = await request({
      url: "/api/shoppingCarList",
      data: {
        token: wx.getStorageSync("token"),
      },
    });
    let addressdata = res.data;
    console.log(addressdata);
    addressdata.map((item) => {
      item['checked'] = true;
      try {
        item.good_name = JSON.parse(item.good_name).name;
        item.img = JSON.parse(item.img)[0];
        item.sku = JSON.parse(item.sku);
      } catch (err) {
        item.sku = JSON.parse(item.sku);
        if (item.img.indexOf("[") != -1) {
          item.img = item.img.replaceAll("[", "");
          item.img = item.img.replaceAll("]", "");
          item.img = item.img.replaceAll('"', "");
          if (item.img.indexOf(",") != -1) {
            item.img = item.img.slice(0, item.img.indexOf(","));
          } else {
            item.img.slice(0, item.img.indexOf(",") + 1);
          }
        } else {
          item.img = item.img.replaceAll('"', "");
        }
        this.data.imgList.push(item.img);
      }
      // if (wx.getStorageSync('cart') !== '') {
      //   this.setData({
      //     cart: wx.getStorageSync('cart')
      //   });
      // }
    });
    if (addressdata.length === 0) {
      this.data.isshow = true
    } else {
      this.data.isshow = false
    }
    this.setData({
      cart: addressdata,
      imgList: this.data.imgList,
      isshow: this.data.isshow,
      addlength: addressdata.length,
    });
    this.setCart(this.data.cart);
    // 关闭下拉
    wx.stopPullDownRefresh();
  },

  async handleSku(e) {
    const {
      goodid
    } = e.currentTarget.dataset;
    const goodsObj = await request({
      url: "/api/goodInfo",
      data: {
        good_id: goodid,
      },
    });
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "linear",
      delay: 0,
    });
    this.animation = animation;
    animation.translateY(animationShowHeight).step();
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
      } catch (error) {
        itm.colour;
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
          });
        }
      } catch (error) {
        itm.edition;
      }
      try {
        itm.imgs = JSON.parse(itm.imgs);
      } catch (error) {
        itm.imgs;
      }
    });
    let that = goodsObj;
    this.setData({
      animationData: animation.export(),
      goodsObj: that,
      showModalStatus: true,
      isScroll: false,
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
        });
      }.bind(this),
      0
    );
    console.log(this.data.goodsObj);
  },
  //隐藏遮罩
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "linear",
      delay: 0,
    });
    that.animation = animation;
    animation.translateY(200).step();
    that.setData({
      animationData: animation.export(),
      showModalStatus: false,
      isScroll: true,
    });
    setTimeout(function () {
      animation.translateY(0).step();
      that.setData({
        animationData: animation.export(),
        istrue: false,
      });
    }, 200);
  },
  // 取消
  cancel() {
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      isScroll: true,
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
            }
          }
        }
      });
    });
    this.setData({
      goodsObj: thats,
      checkde: check,
    });
  },
  // 点击加入购物车
  async handleCardAdd(e) {
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
      let id = this.data.goodsObj.good_id;
      let money = this.data.goodsNum * this.data.goodsObj.price;
      let skus = JSON.stringify(this.data.theSku);
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
        }
      }
      wx.showLoading({
        title: "",
        success: (res) => {
          this.setData({
            isScroll: true,
            showModalStatus: false,
          });
        },
      });
      wx.hideLoading();
    }
  },
  //编辑的点击事件
  Compile(e) {
    this.data.iscompile = false;
    this.data.isfoot = false;
    this.setData({
      iscompile: this.data.iscompile,
      isfoot: this.data.isfoot,
    });
  },
  //完成的点击事件
  Complete() {
    this.data.iscompile = true;
    this.data.isfoot = true;
    this.setData({
      iscompile: this.data.iscompile,
      isfoot: this.data.isfoot,
    });
  },
  //删除购物车
  delete() {
    let shopping_car_id = [];
    for (let i = 0; i < this.data.cart.length; i++) {
      if (this.data.cart[i].checked) {
        shopping_car_id.push(this.data.cart[i].shopping_car_id);
      }
    }
    for (const item of shopping_car_id) {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/shoppingCarDelete",
        data: {
          token: wx.getStorageSync("token"),
          shopping_car_id: item,
        },
        success: (result) => {
          wx.setStorageSync('cart', '')
          this.getdata();
        },
      });
    }
  },
  //获取地址的接口
  //结算的点击事件
  async handlePay(good_id) {
    const {
      isaddress,
      totalNum
    } = this.data;
    if (isaddress === "") {
      await showToast({
        title: "您还没有选择收货地址"
      });
      console.log(111);
      return;
    }
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay?totalPrice=' + this.data.totalPrice,
    })
    this.data.payarr = []
  },
  radioChange(e) {
    console.log("radio发生change事件，携带value值为：", e.detail.value);

    const items = this.data.items;
    console.log(items);

    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value;
    }

    this.setData({
      items,
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
  // 选择地址赋值到页面
  handleAddress(e) {
    console.log(e);
    let item = e.currentTarget.dataset.item;
    console.log(item);
    wx.showLoading({
      success: (res) => {
        wx.setStorageSync("add", item);
        this.onShow();
      },
    });
    setTimeout(() => {
      this.setData({
        showAdres: false,
      });
    }, 400);
    this.hideModal();
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    this.GetAddressList();
    this.delete();
    this.getdata();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得Address组件
    console.log("onReady");
    this.Address = this.selectComponent("#Address");
    // this.getdata();
  },
  onShow: function () {
    const pages = getCurrentPages();
    const perpage = pages[pages.length - 1]
    perpage.onReady();
    this.getdata();
    console.log("onShow");
    this.showAds();
  },
});