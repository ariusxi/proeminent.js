'use strict'

const { resolve } = require('path')
const getPixels = require('get-pixels')
const quantize = require('quantize')

const loadImg = async (img) => {
    return new Promise((resolve, reject) => {
        getPixels(img, (err, pixels) => {
            if (err) reject('Bad image path')
            else resolve(pixels)
        })
    })
}

const validateOptions = (colorCount) => {
    const options = {
        quality: 10,
    }

    if (!colorCount || !Number.isInteger(colorCount)) {
        return {
            ...options,
            colorCount: 10,
        }
    }

    return {
        ...options,
        colorCount,
    }
}

const getArrayOfPixels = (pixels, pixelCount, quality) => {
    const pixelArray = []

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i += quality) {
        offset = i * 4
        r = pixels[offset + 0]
        g = pixels[offset + 1]
        b = pixels[offset + 2]
        a = pixels[offset + 3]

        if (!a || a >= 125) {
            if (r <= 250 && g <= 250 && b <= 250) {
                pixelArray.push([r, g, b])
            }
        }
    }

    return pixelArray
}

const componentToHex = (color) => {
    const hex = color.toString(16)
    return hex.length == 1 ? `0${hex}` : hex
}

const rgbToHex = (r, g, b) => {
    const red = componentToHex(r)
    const green = componentToHex(g)
    const blue = componentToHex(b)

    return `#${red}${green}${blue}`
}

const getColors = async (img) => {
    const { quality, colorCount } = validateOptions()
    
    const imgData = await loadImg(img)

    const pixelLength = imgData.shape[0] * imgData.shape[1]
    const pixelArray = getArrayOfPixels(
        imgData.data, 
        pixelLength, 
        quality,
    )

    const canvasMap = quantize(pixelArray, colorCount)
    const palette = canvasMap ? canvasMap.palette() : null

    return palette.map(([r, g, b]) => rgbToHex(r, g, b))
}

module.exports = getColors