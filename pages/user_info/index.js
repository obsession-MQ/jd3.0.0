import {
  request
} from "../../request/index";
import regeneratorRuntime from "../../libs/runtime/runtime";
const date = new Date();
const years = [];
const months = [];
const days = [];
//获取年
for (let i = 1980; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
Page({
  data: {
    user: {},
    sex: '',
    token: "",
    tempFilePaths: '',
    imgdefalt: "https://img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png",
    // 性别选择
    columns: ["保密", "男", "女"],
    gender: 0 || wx.getStorageSync("gender") * 1,
    // 底部弹框
    show: false,
    position: "",
    customStyle: "",
    inputValue: "",
    // 出生年月
    time: '',
    multiArray: [years, months, days],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
  },

  onShow() {
    this.userData();
    // this.editUser();
    this.setData({
      choose_year: this.data.multiArray[0][0]
    })
  },
  async editUser() {
    const user = wx.getStorageSync('user')
    this.setData({
      inputValue
    })
    wx.setStorageSync('nick_name', this.data.user.nick_name);
    const nick_name = wx.getStorageSync('nick_name');
    console.log(nick_name);
    const res = await request({
      url: "/api/userModify",
      data: {
        token: wx.getStorageSync('token'),
        nick_name: this.data.user.nick_name,
      }
    });
  },
  userData() {
    const user = wx.getStorageSync('user');
    this.data.inputValue = user.nick_name;
    this.setData({
      user: user,
      inputValue: this.data.inputValue
    });
  },
  pickSex: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  popup(e) {
    const position = e.currentTarget.dataset.position;
    let customStyle = "";
    this.setData({
      position,
      show: true,
      customStyle,
    });
  },
  exit() {
    this.setData({
      show: false
    });
    this.onShow();
  },
  clearInp() {
    this.setData({
      inputValue: ""
    });
  },
  chooseimage() {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  //获取时间日期
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    this.setData({
      time: year + '-' + month + '-' + day 
    })
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function(e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { 
        //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { 
        //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { 
        //判断2月份天数
        let year = parseInt(this.data.choose_year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
})