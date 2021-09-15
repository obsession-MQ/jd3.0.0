// pages/feedback/feedback.js
/**
 * 1. 点击+ 触发tap事件
 * 调用api
 * 获取图片路径
 * 存入变量
 * 图片数组进行循环显示自定义组件
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      },
    ],
    // 被选中图片
    chooseImage: [],
    // 文本域内容
    textVal: "",
  },
  // 外网图片数组
  UpLoadImgs: [],
  hanldeChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs,
    });
  },
  handleChooseImg() {
    wx.chooseImage({
      // 同时选中图片的数量
      count: 9,
      // 图片格式
      sizeType: ["original", "compressed"],
      // 图片来源
      sourceType: ["album", "camera"],
      success: (result) => {
        this.setData({
          //图片数组进行拼接
          chooseImage: [...this.data.chooseImage, ...result.tempFilePaths],
        });
      },
    });
  },
  handleRemoveImg(e) {
    // 获取被点击的索引
    const { index } = e.currentTarget.dataset;
    // 获取data数组
    let { chooseImage } = this.data;
    chooseImage.splice(index, 1);
    this.setData({
      chooseImage,
    });
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value,
    });
  },
  handleFormSubmit() {
    const { textVal, chooseImage } = this.data;
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: "输入不合法",
        icon: "success",
        mask: true,
      });
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    // 判断有没有需要上传的图片数组
    if (chooseImage.length != 0) {
      // 3.上传图片到服务器 不支持多个文件上传 遍历数组上传
      chooseImage.forEach((v, i) => {
        wx.uploadFile({
          // 图片上传地址。
          url: "http://api.it120.cc/{domain}/dfs/upload/file​",
          method: "POST",
          // 被上传图片的路径
          filePath: v,
          // 上传文件的名称 后台获取文件 file
          name: "file",
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 所有图片都上传了完毕后才触发
            if (i == chooseImage.length - 1) {
              wx.hideLoading();
              console.log("把文本和图片提交到数组中 提交到后台中");
              this.setData({
                textVal: "",
                chooseImage: [],
              });
              wx.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    } else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1,
      })
    }
  },
});
