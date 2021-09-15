// components/Tabs/Tabs.js
Component({
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[],
      children:{
        value:[],
        type:Array
      }
    },
    FilterList:{
      type:Array,
      value:[]
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    showSort:false,
    changeStyleFlag:true,
    upFlag:true,
    downFlag:true,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFilter(e){
      const {index}=e.currentTarget.dataset;
      this.triggerEvent("tabsFilterChange",{index})
    },
    handleItemTap(e){
      if(e.currentTarget.dataset.index == 0){
        this.setData({
          showSort:!this.data.showSort,
        });
      }
      if(e.currentTarget.dataset.index == 2){
        if(this.data.downFlag){
          this.setData({
            upFlag:true,
            downFlag:false,
          });
        }else{
          this.setData({
            upFlag:false,
            downFlag:true,
          });
        }
        // console.log(index,upFlag);
      }
      const {index} = e.currentTarget.dataset;
      const upFlag = this.data.upFlag;
      this.triggerEvent("tabsItemChange",{index,upFlag})
    },
    checkedOnTap(event){
      this.setData({
        showSort:!this.data.showSort
      });
      console.log(event.currentTarget.dataset.con);
      this.properties.tabs.value=event.currentTarget.dataset.con;
      this.triggerEvent("tabsSortWay",event.currentTarget.dataset.con);
    },
    onChangeStyle(){
      this.setData({
        changeStyleFlag:!this.data.changeStyleFlag
      });
      this.triggerEvent("changeStyleFlag",this.data.changeStyleFlag);
    }
  }
})
