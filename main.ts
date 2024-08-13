import * as fs from 'fs-extra'
import * as cron from 'node-cron'
import consola from 'consola'
import { ofetch } from 'ofetch'
import packageJson from './package.json' with { type: 'json' }
import { CONFIG, YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } from './setting'
import { runBot } from './src/bot'
import { getNicoNicoStream, getNicoNicoVideo, setNicoStreamIds, setNicoVideoIds } from './src/niconico'

async function main() {
  consola.info(`Starting Video Upload Notification Bot v${packageJson.version}...`)

  fs.ensureDir('_temp/')

  // YouTube初回ロード
  const firstLoadYouTubeURL = 'https://www.googleapis.com/youtube/v3/playlistItems'
  const res = await ofetch(firstLoadYouTubeURL, {
    method: 'GET',
    query: {
      part: 'snippet',
      playlistId: YOUTUBE_PLAYLIST_ID,
      key: YOUTUBE_API_KEY,
    },
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {
    throw new Error('初回取得エラー')
  })

  consola.success('YouTube 最新動画: ', res.items[0].snippet.title)

  // 初回の動画IDリスト生成
  const ary: string[] = []
  for (let i = 0; i < 5; i++) {
    ary.push(res.items[i].snippet.resourceId.videoId)
  }
  fs.writeFileSync('_temp/youtube', ary.join(','))

  // ニコニコ 初回ロード
  if (CONFIG.niconico) {
    const nicoVideo = await getNicoNicoVideo().catch(() => {
      throw new Error('初回取得エラー')
    })
    const nicoStream = await getNicoNicoStream().catch(() => {
      throw new Error('初回取得エラー')
    })

    consola.success('ニコニコ 最新動画: ', nicoVideo.data.items[0].essential.title)
    consola.success('ニコニコ 最新生放送: ', nicoStream.data.programsList[0].program.title)

    setNicoVideoIds(nicoVideo.data.items.map(m => m.essential.id))
    setNicoStreamIds(nicoStream.data.programsList.map(m => m.id.value))
  }

  // タスクスケジュール設定
  cron.schedule('5,35 * * * * *', async () => {
    try {
      await runBot('youtube')
      if (CONFIG.niconico) {
        await runBot('niconico')
      }
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
