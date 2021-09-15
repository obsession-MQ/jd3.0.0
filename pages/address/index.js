
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    token:"",
  },


  //新增收货地址页面跳转
  handleAddAddr() {
    wx.navigateTo({
      url: '/pages/address_setting/index',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  onShow: function () {
     //获取token
     let user = wx.getStorageSync("user");
     let token = user.token
     if(!token){
       wx.showToast({
         title: '请先登录',
         icon: 'none',
       });
       setTimeout(() => {
         wx.navigateBack({
           delta: 1
         });
       }, 1500);
     }else{
       this.setData({
         token
       })
     }
    //请求地址列表数据
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressList',
      data: {
        token: this.data.token,
        groupid: 2
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result.data.data);
        let newlist = [...result.data.data.reverse()];
        // console.log(newlist);
        let temp;
        for(let i=0;i<newlist.length;i++){
          for(let j=0;j<newlist.length-i-1;j++){
            if(newlist[i].default<newlist[j+1].default){
              temp = newlist[j]
              newlist[j]=newlist[j+1];
              newlist[j+1]=temp;
            }
          }
        }
        this.setData({
          addressList:newlist,
        })
        //将请求的数据放缓存里面
        wx.setStorageSync("address",result.data.data);
      },
      fail: () => { },
      complete: () => {}
    });
  },

  //编辑跳转页面
  handleEdit(e){
    let index = e.currentTarget.dataset.index;
    let obj = this.data.addressList[index];
    obj = JSON.stringify(obj)
    wx.navigateTo({
      url: '/pages/address_setting/index?obj='+obj,
    });

  },
})