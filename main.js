import fs from 'fs-extra'
import { YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY, DISCORD_CHANNEL_ID_MOVIE, DISCORD_CHANNEL_ID_LIVE } from './setting.js'

const main = async function (client) {
  try {
    // YouTube Data API
    const YouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`

    // 最新動画取得
    const youtubeDataResFetch = await fetch(
      YouTubeURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    )

    const youtubeDataRes = await youtubeDataResFetch.json()
    const videoID = youtubeDataRes.items[0].snippet.resourceId.videoId
    const title = youtubeDataRes.items[0].snippet.title

    // ライブ情報取得
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${YOUTUBE_API_KEY}`, { method: "GET", headers: { 'Content-Type': 'application/json' } }).then((res) => {
      res.json().then((v) => {
        const isLiveStream = v.items[0].snippet.liveBroadcastContent
        const latestMovieIDList = fs.readFileSync("movieid", 'utf-8').split(',')
        for (const item of latestMovieIDList) {
          if (videoID === item) return
          if (isLiveStream === 'upcoming') return
        }
        console.log("run: ", title)

        // ファイル更新
        const ary = []
        for (let i = 0; i < 5; i++) {
          ary.push(youtubeDataRes.items[i].snippet.resourceId.videoId)
        }
        fs.writeFileSync("movieid", ary.join(','))
        // チャット送信

        if (isLiveStream === 'live') {
          client.channels.cache.get(DISCORD_CHANNEL_ID_LIVE).send(`🔔 配信開始\n\n${title}\nhttps://youtu.be/${videoID}`)
        } else {
          client.channels.cache.get(DISCORD_CHANNEL_ID_MOVIE).send(`🎬 動画投稿\n\n${title}\nhttps://youtu.be/${videoID}`)
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}

export { main }