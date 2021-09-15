// components/AllTypes/AllTypes.js
Component({
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showTypeFlag:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        showTypeFlag:false
      });
      this.triggerEvent('closeTypes', true);
    }
  }
})
