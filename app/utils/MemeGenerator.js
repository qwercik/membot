import { createCanvas, loadImage } from 'canvas'
import language from 'app/language'

function generate (path, topText, bottomText) {
  return new Promise((resolve, reject) => {
    loadImage(path)
      .then(image => {
        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(image, 0, 0)
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2

        const fontSize = image.height * 0.15
        ctx.font = `bold ${fontSize}px Impact`

        const topTextMargin = ctx.measureText(topText.toUpperCase()).width > 0.9 * image.width ? 0.05 * image.width : (image.width - ctx.measureText(topText.toUpperCase()).width) / 2
        ctx.fillText(topText.toUpperCase(), topTextMargin, image.height * 0.20, 0.9 * image.width)
        ctx.strokeText(topText.toUpperCase(), topTextMargin, image.height * 0.20, 0.9 * image.width)

        const bottomTextMargin = ctx.measureText(bottomText.toUpperCase()).width > 0.9 * image.width ? 0.05 * image.width : (image.width - ctx.measureText(bottomText.toUpperCase()).width) / 2
        ctx.fillText(bottomText.toUpperCase(), bottomTextMargin, image.height * 0.95, 0.9 * image.width)
        ctx.strokeText(bottomText.toUpperCase(), bottomTextMargin, image.height * 0.95, 0.9 * image.width)

        resolve(canvas.createJPEGStream())
      })
      .catch(sth => {
        reject(new Error(language['picture_file_loading_error']))
      })
  })
};

export default { generate }
