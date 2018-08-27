import WeCropper from '../../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 73,
        y: 103,
        width: 268,
        height: 386
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    this.wecropper.getCropperImage((pic) => {
      if (pic) {
         //获取到裁剪后的图片
        wx.navigateTo({
          url: `../../pages/filter/filter?pic=${pic}`
        })
        console.info('avatar:' + pic)
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    //获取图片的位置和宽度信息
    var picX = option.picX
    var picY = option.picY
    var picWidth = option.picWidth
    var picHeight = option.picHeight

    var data_picX = "cropperOpt.cut.x"
    var data_picY = "cropperOpt.cut.y"
    var data_width = "cropperOpt.cut.width"
    var data_height = "cropperOpt.cut.height"

    var parampicX = {}
    var parampicY = {}
    var paramwidth = {}
    var paramheight = {}

    parampicX[data_picX] = picX
    parampicY[data_picY] = picY
    paramwidth[data_width] = picWidth
    paramheight[data_height] = picHeight

    this.setData({
      parampicX,
      parampicY,
      paramwidth,
      paramheight
    })
    const { cropperOpt } = this.data
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.info(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.info(`before picture loaded, i can do something`)
          console.info(`current canvas context:`, ctx)
          wx.showToast({
            title: '加载图片',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})
