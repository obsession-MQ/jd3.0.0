// pages/pay1/pay1.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    giftshow: false,
    show: true,
    totalPrice:'',
    paycart: [],
    shopCarId: [],
    address:{},
    aid:"1400"
  },
  //展开礼品卡
  ShowGift() {
    this.setData({
      giftshow: true,
      show: false,
    })
  },
  //收起礼品卡
  PackGift() {
    this.setData({
      giftshow: false,
      show: true,
    })
  },
  // 获取地址列表
  GetAddressList(_addid) {
    let token = wx.getStorageSync('token')
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressList',
      data: {
        token: token,
      },
      success: (res) => {
        res.data.data.forEach(item=>{
          console.log(_addid);
          if(item.address_id == Number(_addid)){
            this.setData({
              address:item
            })
          }
        })
      }
    })
  },
  //生成订单
  toPay() {
    let token = wx.getStorageSync('token');
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/generateOrder',
      method: "POST",
      data: {
        token: token,
        address_id: this.data.aid,
        money: '0.01',
        shopping_car_ids: this.data.shopCarId
      },
      success: (res) => {
        console.log(res);
        if (res.data.data.length != 0) {
          let prepay = 'prepay_id=' + res.data.data.prepay_id
          wx.requestPayment({
            appid: res.data.data.appid,
            nonceStr: res.data.data.nonce_str,
            package: prepay,
            timeStamp: res.data.data.timeStamp,
            signType: "MD5",
            paySign: res.data.data.paySign,
            success: res => {
              // 订单生产之后不管成功还是失败都要清除购物车中的东西
              this.data.shopCarId.forEach(v => {
                wx.request({
                  url: 'http://api_devs.wanxikeji.cn/api/shoppingCarDelete',
                  method: "POST",
                  data: {
                    token: token,
                    shopping_car_id: v
                  },
                  success: res => {
                    wx.navigateTo({
                      url: '../order/order',
                    })
                    wx.setStorageSync('cart', [])
                  }
                })
              })
            },
            fail: res => {
              this.data.shopCarId.forEach(v => {
                wx.request({
                  url: 'http://api_devs.wanxikeji.cn/api/shoppingCarDelete',
                  method: "POST",
                  data: {
                    token: token,
                    shopping_car_id: v
                  },
                  success: res => {
                    wx.navigateTo({
                      url: '../order/order',
                    })
                    wx.setStorageSync('cart', [])
                  }
                })
              })
            },
          })
        }

      },
    });
    this.data.payarr = [];
  },
  getdata() {
    let addressdata = wx.getStorageSync('cart');
    addressdata.map(v => {
      if (v.checked) {
        this.data.paycart.push(v);
        this.data.shopCarId.push(v.shopping_car_id);
        this.setData({
          paycart: this.data.paycart
        });
      }
    })
    this.setData({
      // cart: addressdata,
      isshow: this.data.isshow,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    this.data.totalPrice = options.totalPrice;
    if(options.addid!==undefined){
      this.data.aid = options.addid;
      this.setData({
        aid:this.data.aid
      })
    }
    if(options.orderList!==undefined){
      this.setData({
        paycart : []
      });
      let orderList = JSON.parse(options.orderList);
      orderList.good_name = orderList.good_name.name;
      this.data.paycart.push(orderList);
      this.setData({
        paycart:this.data.paycart,
      })
    }
    this.setData({
      totalPrice:this.data.totalPrice
    })
    let addid = wx.getStorageSync("add")
    if(!addid.length){
      this.data.address = addid;
      this.setData({
        address:this.data.address
      });
    }else{
      console.log(this.data.aid);
      this.GetAddressList(this.data.aid);
    }
    this.getdata();
  },
  toChooseAddress() {
    wx.navigateTo({
      url: '/pages/address/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    this.setData({
      username: wx.getStorageSync("username")
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onSow");
    let addid = wx.getStorageSync("add")
      this.setData({
        address:addid
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})