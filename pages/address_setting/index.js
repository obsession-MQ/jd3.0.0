Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phoneNum: "",
    address: "",
    detaiAddr: "",
    alertText: "",
    alert: 0,
    procince: "",
    city: "",
    area: "",
    token: "",
    default: false,
    articleId: "",
    addressId: "",
    flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取地址列表传过来的参数
    if (options.obj) {
      options = JSON.parse(options.obj)
      this.setData({
        obj:options
      });
      this.setData({
        name: options.name,
        phoneNum: options.phone,
        address: options.procince + options.city + options.area,
        detaiAddr: options.detailed.replace(options.procince + options.city + options.area, ''),
        addressId: options.address_id,
        procince: options.procince,
        city: options.city,
        area: options.area,
        flag: true,
      })
    }
    let user = wx.getStorageSync("user");
    let token = user.token
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
    } else {
      this.setData({
        token
      })
    }
  },
  name() {},
  phone() {},
  alert(text) {
    wx.showToast({
      title: text,
      icon: 'none',
    });
  },
  //保存按钮
  saveAddress() {
    let name = this.data.name;
    let phone = this.data.phoneNum;
    let adddress = this.data.address;
    let detaiAddr = this.data.detaiAddr;
    const reg = /[\u4e00-\u9fa5_a-aA-Z]/ig
    const reg2 = /(^[0-9]*$)/
    if (name.trim() == "") {
      this.alert("请填写收货人姓名")
    } else if (!reg.test(name)) {
      this.alert("姓名只能写中文或字母")
    } else if (phone.trim() == "") {
      this.alert("请填写手机号码")
    } else if ((!reg2.test(phone) || phone.trim().length != 11) && this.data.flag == false) {
      this.alert("手机号码格式不对")
    } else if (adddress.trim() == "") {
      this.alert("请选择省份市")
    } else if (detaiAddr.trim() == "") {
      this.alert("请填写详细地址")
    } else {
      wx.request({
        url: 'http://api_devs.wanxikeji.cn/api/userAddressAddModify',
        data: {
          token: this.data.token,
          phone: phone.replace(phone.substring(3, 7), "****"),
          procince: this.data.procince,
          city: this.data.city,
          area: this.data.area,
          name: this.data.name,
          detailed: adddress + detaiAddr,
          address_id: this.data.addressId,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          // console.log(result);
          //如果设置了默认地址
          if (this.data.default) {
            if (this.data.flag) {
              this.defaultFun(this.data.addressId)
            } else {
              this.defaultFun(result.data.other.add_address_id)
            }
          }
        },
      });

      //按了保存地址后自动跳转至地址列表页面
      if (!this.data.default) {
        //请求地址列表数据
        wx.request({
          url: 'http://api_devs.wanxikeji.cn/api/userAddressList',
          data: {
            token: this.data.token,
            groupid: 2
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (result) => {
            // console.log(result.data.data);
            let newlist = [...result.data.data.reverse()];
            // console.log(newlist);
            let temp;
            for (let i = 0; i < newlist.length; i++) {
              for (let j = 0; j < newlist.length - i - 1; j++) {
                if (newlist[i].default < newlist[j + 1].default) {
                  temp = newlist[j]
                  newlist[j] = newlist[j + 1];
                  newlist[j + 1] = temp;
                }
              }
            }
            this.setData({
              addressList: newlist,
            })
            //将请求的数据放缓存里面
            wx.setStorageSync("add", result.data.data);
            wx.navigateTo({
              url: '/pages/pay/pay?addid='+JSON.stringify(this.data.obj.address_id),
              success() {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
            });
          },
          fail: () => {},
          complete: () => {}
        });
      }

    }
  },
  //封装获取默认地址函数
  defaultFun(_id) {
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressDfault',
      data: {
        token: this.data.token,
        id: _id,
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res);
        wx.navigateTo({
          url: '/pages/address/index',
        });
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  //picker获取地址
  handlepicker(e) {
    // console.log(e.detail);
    let addrStr = e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    let procince = e.detail.value[0]
    let city = e.detail.value[1]
    let area = e.detail.value[2]
    this.setData({
      address: addrStr,
      procince,
      city,
      area
    })
  },
  //获取地址
  handleGetAddr() {
    wx.chooseLocation({
      success: (result) => {
        let procince = result.address.substring(0, 3)
        let city = result.address.substring(3, 6)
        let area = result.address.substring(6, result.address.length)
        this.setData({
          address: result.address,
          detaiAddr: result.name,
          procince,
          city,
          area
        })
      },
      fail: () => {},
      complete: () => {}
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //设置默认地址
  defaultAddr(e) {
    this.setData({
      default: e.detail.value
    })


  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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