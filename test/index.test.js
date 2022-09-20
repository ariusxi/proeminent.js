'use strict'

const { resolve } = require('path')
const Proeminent = require(resolve(process.cwd()), 'src/index.js')

const img = resolve(process.cwd(), 'image.jpg')

test('Returns the colors of the image', async () => {
    const res = await Proeminent(img)
    expect(res.length).toEqual(9)
})