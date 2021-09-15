Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category:{
      type:Array,
      value:[]
    },
    Version:{
      type:Array,
      value:[]
    },
    Howbuy:{
      type:Array,
      value:[]
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
    handleItemTap(e){
      const {index}=e.currentTarget.dataset
      this.triggerEvent("tabsItemChange",{index})
    },
    handleItemVersion(e){
      const {index}=e.currentTarget.dataset
      this.triggerEvent("tabsItemVersion",{index})
    },
    handleItemHowbuy(e){
      const {index}=e.currentTarget.dataset
      this.triggerEvent("tabsItemHowbuy",{index})
    }
  }
})
