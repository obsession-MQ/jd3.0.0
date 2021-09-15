let ajxtimes = 0
export const request=(params)=>{
  ajxtimes++
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  return new Promise ((resolve,reject)=>{
    wx.request({
      ...params,
     success:(res)=>{
       resolve(res)
     },
     fail:(err)=>{
       reject(err)
     },
     complete() {
       ajxtimes--
       if (ajxtimes===0) {
         wx.hideLoading()
       }
     }
    })
  })
}