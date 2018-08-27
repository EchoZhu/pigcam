// pages/nomo/nomo.js
const ctx = wx.createCanvasContext('myCanvas')
var WxCaman = require('../../utils/wx-caman.js').default
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
    filterhiddentag: true,
    pic: ''
  },
  save: function() {
    var that = this
    ctx.draw(true, setTimeout(function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.canvasWidth,
        height: that.data.canvasHeight,
        destWidth: that.data.canvasWidth,
        destHeight: that.data.canvasHeight,
        canvasId: 'myCanvas',
        fileType: 'jpg',
        quality: 1,
        success: function(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
          })
          wx.showToast({
            title: '图片已成功保存到本地',
            icon: 'none'
          })
        }
      })
    }, 100))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取裁剪之后的图片
    var pic = options.pic
    this.setData({
      pic: pic
    })
    var screenWidth = wx.getSystemInfoSync().windowWidth
    var screenHeight = wx.getSystemInfoSync().windowHeight //屏幕高度
    console.info("screenWidth:" + screenWidth + "screenHeight:" + screenHeight)
    this.setData({
      canvasWidth: screenWidth - 2,
      canvasHeight: screenHeight - 100,
    })
    console.info("canvas_width:" + this.data.canvasWidth + "canvas_height:" + this.data.canvasHeight)

    // 绘制截图的背景-白色
    ctx.rect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.draw()
    //绘制边框
    this.drawFram(pic)

  },
  drawFram: function(temtempFilePath, filter) {
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
    console.info("grey:" + greyX + ":" + greyY + ":" + greyWidth + ":" + greyHeight)

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

    //在宽银色区域里绘制一句话
    ctx.setFontSize(16)
    // 设置字体颜色
    ctx.setFillStyle("#fff");
    ctx.setShadow(0, 1, 1, 'grey')

    var quotes = wx.getStorageSync('quotes')
    var quotesIndex = parseInt(Math.random() * (3 + 1), 10);
    console.info("quotesIndex--" + quotesIndex)
    ctx.fillText(quotes[quotesIndex], greyrectX + 26, greyrectY + 25)


    //默认不需要绘制图片，当选择图片之后开始绘制
    if (temtempFilePath != '') {
      var that = this
      ctx.drawImage(temtempFilePath, that.data.picX, that.data.picY, that.data.picWidth, that.data.picHeight)
      // ctx.drawImage(res.tempFilePaths[0], 30, 30, 150, 100)
      console.info("pic-1:" + that.data.picX + ":" + that.data.picY + ":" + that.data.picWidth + ":" + that.data.picHeight)
    }

    ctx.draw(true, function() {
      var picWidth = that.data.picWidth
      var picHeight = that.data.picHeight
      var picX = that.data.picX
      var picY = that.data.picY
      console.info("picX:" + picX + "picY:" + picY)
      new WxCaman('myCanvas', picX, picY, picWidth, picHeight, function() {
        // this.brightness(17)
        // this.saturation(+49)
        // this.hue(9)
        if (filter == 'lomo') {
          this.lomo(false)
          this.render()
        } else if (filter == 'pinhole') {
          this.pinhole(false)
          this.render()
        } else if (filter == '') {

        }

      })

    })
    console.info("greyrect:" + greyrectX + ":" + greyrectY + ":" + greyrectWidth + ":" + greyrectHeight)


    console.info("pic:" + this.data.picX + ":" + this.data.picY + ":" + this.data.picWidth + ":" + this.data.picHeight)
  },
  //选择滤镜
  chosefilter: function() {
    var that = this
    var filtertag = that.data.filterhiddentag
    that.setData({
      filterhiddentag: !Boolean(filtertag)
    })
  },
  //选择lomo滤镜
  lomo: function() {
    var pic = this.data.pic
    this.drawFram(pic, 'lomo')
  },
  //选择灰色滤镜
  greyfilter: function() {
    var pic = this.data.pic
    this.drawFram(pic, 'pinhole')
  },
  //滤镜选择完毕
  done: function() {
    var that = this
    var filtertag = that.data.filterhiddentag
    that.setData({
      filterhiddentag: !Boolean(filtertag)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  share: function() {
    console.info("我用这款小程序制作了拍立得相片，你也来试一下？")
    this.onShareAppMessage()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '我用小猪相机制作了拍立得相片，你也来试一下？',
      path: '/pages/index/index'
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