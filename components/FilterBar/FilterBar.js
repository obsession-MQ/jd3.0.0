// components/FilterBar/FilterBar.js
import {
  request
} from "../../request/index";
Component({
  options: {
    addGlobalClass: true
  },
  externalClasses: ['filterbar-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    filterFlag: {
      type: Boolean,
      value: false
    },
    address: {
      type: String,
      value: ""
    },
    FilterList: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showAddressflag: false,
    showTypeflag: false,
    showInfo: true,
    isChecked: false,
    tags: {},
    tagId: null,
    brandList: [{
        con: '联想',
        isChecked: false
      },
      {
        con: '华为',
        isChecked: false
      },
      {
        con: '惠普',
        isChecked: false
      },
      {
        con: '华硕',
        isChecked: false
      },
      {
        con: '荣耀',
        isChecked: false
      },
      {
        con: '戴尔',
        isChecked: false
      },
      {
        con: 'ThinkPad',
        isChecked: false
      },
      {
        con: 'Apple',
        isChecked: false
      },
      {
        con: '查看全部',
        isChecked: false
      }
    ],
    priceRange: [{
        price: "10-100",
        min: "10",
        max: "100",
        percent: 47,
        isChecked: false
      },
      {
        price: "100-200",
        min: "100",
        max: "200",
        percent: 26,
        isChecked: false
      },
      {
        price: "200-500",
        min: "200",
        max: "500",
        percent: 17,
        isChecked: false
      },
    ],
    minPrice: "",
    maxPrice: "",
    showToast: false,
    count: 0,
    selected: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取地址
    getAddress(e) {
      console.log(e.detail);
      this.setData({
        address: e.detail
      })
    },
    //重置筛选
    resetFilter() {
      this.properties.FilterList.forEach(item => {
        item.isChecked = false;
      });
      this.data.brandList.forEach(item => {
        item.isChecked = false;
      });
      this.setData({
        FilterList: this.properties.FilterList,
        brandList: this.data.brandList,
        minPrice: "",
        maxPrice: ""
      });
      this.triggerEvent("tagsChoose", this.properties.FilterList);
    },
    //关闭筛选
    onCloseFilter() {
      this.setData({
        filterFlag: false
      })
      this.triggerEvent("filterFlag", false);
    },
    onShowInfo(event) {
      this.setData({
        showInfo: event.detail
      })
    },
    //展示全部分类
    showType() {
      this.setData({
        showInfo: false,
        showAddressflag: false,
        showTypeflag: true
      });
    },
    //获取地址,展示地址
    async showAddress() {
      this.setData({
        showInfo: false,
        showTypeflag: false,
        showAddressflag: true
      });
      const Address = await request({
        url: "/api/userAddressList",
        data: {
          token: wx.getStorageSync("token"),
        },
      });
      console.log(Address);
      this.setData({
        GetAddressList: Address,
      });
    },
    //选择价格区间
    onChooseRange(event) {
      console.log(event.currentTarget.dataset);
      const min = event.currentTarget.dataset.range.min
      const max = event.currentTarget.dataset.range.max
      const index = event.currentTarget.dataset.id;
      this.data.priceRange.forEach((v, i) => {
        console.log(i === index);
        if (i === index) {
          v.isChecked = true;
        }else{
          v.isChecked = false;
        }
      });
      console.log(this.data.priceRange);
      this.setData({
        priceRange: this.data.priceRange,
        minPrice: min,
        maxPrice: max
      });
    },
    //选择筛选条件
    onChecked(event) {
      const index = event.currentTarget.dataset.id;
      const item = event.currentTarget.dataset.item;
      const con = event.currentTarget.dataset.con;
      //品牌点击事件
      if (item == "品牌") {
        let brandList = this.data.brandList;
        brandList.forEach((v, i) => {
          if (i === index) {
            if (!v.isChecked) {
              //超过六个不能再点
              if (this.data.count > 5) {
                console.log(this.data.count);
                this.setData({
                  showToast: true
                })
              } else {
                v.isChecked = !v.isChecked;
                this.data.count++;
                this.data.selected.push(con);
                // wx.setStorageSync('selected', this.data.selected);
              }
            } else {
              v.isChecked = !v.isChecked;
              this.data.count--;
              this.data.selected.forEach(item => {
                if (item == con) {
                  this.data.selected.splice(index, 1);
                }
              })
              // wx.setStorageSync('selected', this.data.selected);
            }
          }
        });
        this.setData({
          brandList,
          selected: this.data.selected
        });
      }
      //分类点击事件
      if (item == "分类") {
        let FilterList = this.properties.FilterList;
        FilterList.forEach((v, i) => {
          if (i === index) {
            v.isChecked = !v.isChecked;
          }
        });
        this.setData({
          FilterList,
        });
        console.log(this.data.FilterList);
        this.triggerEvent("tagsChoose", this.properties.FilterList);
      }
    }
  }
})