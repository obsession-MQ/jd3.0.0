// components/AddressList/AddressList.js
import { regionData } from "../../components/select/city";
Component({
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showAddressFlag:{
      type:Boolean,
      value:false
    },
    addressList:{
      type:Array,
      value:[]
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
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
    toChoose:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showList(e){
      this.setData({
        toChoose:e.detail
      })
    },
  // 选择地址赋值到页面
  handleAddress(e) {
    let { name,id } = e.currentTarget.dataset;
    this.triggerEvent('address',e.currentTarget.dataset.name);
    wx.showLoading({
      success: (res) => {
        wx.setStorageSync("add", name);
        wx.setStorageSync('id', id)
        // this.onShow();
        this.setData({
          detailed: id,
        });
      },
    });
    setTimeout(() => {
      this.setData({
        showAdres: false,
      });
      wx.hideLoading();
      this.onClose();
    }, 1000);
  },
    onClose(){
      this.setData({
        showAddressFlag:false
      })
      this.triggerEvent('closeAddress', true);
    },
    // 点击输入框弹出地址选择框
    cityFocus() {
      this.setData({
        "city.show": true,
        IsBack: true,
        dis: true,
        toChoose:false
      });
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
      this.triggerEvent('address', address.join(""));
      this.setData({
        "city.selected": selected,
        "city.value": list,
      });
      this.onClose();
      // this.onShow();
    }
  }
})
