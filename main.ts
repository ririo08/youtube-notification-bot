import * as fs from 'fs-extra'
import * as cron from 'node-cron'
import consola from 'consola'
import { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } from './setting'
import { runBot } from './src/bot'

async function main() {
  consola.info(`Starting YouTube Notification Bot...`)

  // 初回ロード
  const firstLoadYouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`

  const res = await fetch(firstLoadYouTubeURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).catch((e) => {
    throw e
  })
  if (res.status !== 200) {
    throw new Error('取得エラー')
  }

  const resJson: any = await res.json()
  consola.success('最新動画: ', resJson.items[0].snippet.title)

  // 初回の動画IDリスト生成
  const ary: string[] = []
  for (let i = 0; i < 5; i++) {
    ary.push(resJson.items[i].snippet.resourceId.videoId)
  }
  fs.writeFileSync('movie-id', ary.join(','))

  // タスクスケジュール設定
  cron.schedule('5,35 * * * * *', () => {
    try {
      runBot()
    }
    catch (e) {
      consola.error(e)
    }
  })
}

/** 起動 */
async function TryConnect() {
  try {
    await main()
  }
  catch (e) {
    consola.error('tryConnect:', e)
    setTimeout(() => {
      consola.info('Retry connect...')
      TryConnect()
    }, 1000 * 60)
  }
}

TryConnect()
