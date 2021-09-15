// pages/search/search.js
import { request } from "../../request/index";
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inpValue:""
  },
  TimeId: -1,
  // 防抖 定时器 节流
  // 防止重复输入 重复发送请求
  // 节流 在页面中下拉和上拉
  // 定义全局的定时器id
  // 搜索事件
  handleInput(e) {
    // 1.获取输入框的值
    const { value } = e.detail;
    // 设置定时器
    clearTimeout(this.TimeId);
    // 2.检查合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    // 3.发送请求
    this.setData({
      isFocus: true,
    });
    // 开启定时器 1s钟之后执行
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求的函数
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query }});
    this.setData({
      goods: res
    });
  },
  // 点击取消清空input
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
});
