// pages/nomo/nomo.js
const ctx = wx.createCanvasContext('myCanvas-index')
var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    shotX: 0,
    shotY: 0,
    shotWidth: 0,
    shotHeight: 0,
    picX: 0,
    picY: 0,
    picWidth: 0,
    picHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  //从拍照或者相册选择图片
  chose: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        var temtempFilePath = res.tempFilePaths[0]
        var picX = that.data.picX
        var picY = that.data.picY
        var picWidth = that.data.picWidth
        var picHeight = that.data.picHeight
        wx.redirectTo({
          url: `../../pages/cropper/cropper?src=${temtempFilePath}?picX=${picX}?picY=${picY}?picWidth=${picWidth}?picHeight=${picHeight}`
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载远端数据
    let Product = new wx.BaaS.TableObject('sentence')
    Product.get('5b7cc7f30e16543f310e58f3').then(res => {
      // success
      var quotes = res.data.quotes
      wx.setStorageSync('quotes', quotes)
    }, err => {
      // err
    })
    var screenWidth = wx.getSystemInfoSync().windowWidth
    var screenHeight = wx.getSystemInfoSync().windowHeight //屏幕高度
    // console.info("screenWidth:" + screenWidth + "screenHeight:" + screenHeight)
    this.setData({
      canvasWidth: screenWidth - 2,
      canvasHeight: screenHeight - 100,
    })

    // 绘制截图的背景-白色
    ctx.rect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.draw()
    //绘制边框
    this.drawFram('')

  },
  drawFram: function (temtempFilePath) {
    //确定截图的范围
    var screenWidth = wx.getSystemInfoSync().windowWidth //屏幕宽度
    var screenHeight = wx.getSystemInfoSync().windowHeight //屏幕高度
    var exotheciumWidth = screenWidth - 60
    var exotheciumHeight = screenHeight - 150

    this.setData({
      shotX: 30 - 13,
      shotY: 30 - 13,
      shotWidth: exotheciumWidth + 26,
      shotHeight: exotheciumHeight + 26 + 50
    })
    //绘制canvas底色，分享图片底色
    // ctx.rect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    // ctx.setFillStyle('#ffffff')

    //绘制边框
    var greyX = 30 + 30
    var greyY = 30 + 30
    var greyWidth = exotheciumWidth - 60
    var greyHeight = exotheciumHeight - 110

    ctx.setLineWidth(26)
    ctx.setStrokeStyle('#e9e9e9')
    // ctx.strokeRect(30, 30, exotheciumWidth, exotheciumHeight)
    ctx.strokeRect(greyX, greyY, greyWidth, greyHeight)
    // console.info("grey:" + greyX + ":" + greyY + ":" + greyWidth + ":" + greyHeight)

    //绘制底部方块 13是灰色线条的宽度的一半
    var greyrectX = greyX - 13
    var greyrectY = greyY + greyHeight + 13
    var greyrectWidth = greyWidth + 26
    var greyrectHeight = 50

    this.setData({
      picX: greyrectX + 26,
      picY: greyrectY - greyHeight,
      picWidth: greyWidth - 26,
      picHeight: greyHeight - 26
    })

    //绘制底宽银色区域
    ctx.rect(greyrectX, greyrectY, greyrectWidth, greyrectHeight)
    ctx.setFillStyle('#ededed')
    //绘制阴影
    ctx.setShadow(0, 3, 1, 'grey')
    ctx.fill()
    ctx.draw()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我用小猪相机制作了拍立得相片，你也来试一下？',
      path: '/pages/nomo/nomo'
    }
  },
  roundRect2(mctx, x, y, w, h, r, stroke, color) {
    mctx.save();
    mctx.beginPath();
    if (stroke) {
      mctx.setStrokeStyle(color)
    } else {
      mctx.setFillStyle(color)
    }
    x += 0.5
    y += 0.5
    mctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    mctx.moveTo(x + r, y)
    mctx.lineTo(x + w - r, y)
    mctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    mctx.lineTo(x + w, y + h - r)
    mctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    mctx.lineTo(x + r, y + h)
    mctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    mctx.lineTo(x, y + r)
    if (stroke) {
      mctx.stroke()
    } else {
      mctx.fill()
    }
    mctx.closePath()
    mctx.draw(true)

  }
})