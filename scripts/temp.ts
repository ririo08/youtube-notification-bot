import * as fs from 'fs-extra'

fs.mkdirSync('_temp/')

fs.writeFileSync('_temp/youtube', 'a,b,c')
fs.writeFileSync('_temp/nico-video', 'a,b,c')
fs.writeFileSync('_temp/nico-stream', 'a,b,c')