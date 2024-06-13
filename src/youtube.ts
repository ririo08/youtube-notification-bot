import * as fs from 'fs-extra'
import { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } from '../setting'
import { logError } from './utils/log-error'

interface YouTubeResponse {
  title: string
  url: string
  thumbnailUrl: string
  isLiveStream: boolean
}

export async function getNewVideo(): Promise<YouTubeResponse | undefined> {
  // YouTube Data API
  const YouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`

  // 最新動画取得
  const youtubeDataResFetch = await fetch(YouTubeURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((e) => {
    logError('ライブ情報取得', e)
  })

  if (typeof youtubeDataResFetch === 'undefined')
    return
  if (youtubeDataResFetch.status !== 200) {
    logError('最新動画取得 ログ取得エラー', youtubeDataResFetch.status)
    return
  }

  const youtubeDataRes: any = await youtubeDataResFetch.json()
  const videoID: string = youtubeDataRes.items[0].snippet.resourceId.videoId

  // ライブ情報取得
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${YOUTUBE_API_KEY}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  ).catch((e) => {
    logError('ライブ情報取得', e)
  })

  if (typeof res === 'undefined')
    return
  if (res.status !== 200) {
    logError('ライブ情報取得 ログ取得エラー', res.status)
    return
  }

  const resJson: any = await res.json()

  // 新コンテンツチェック
  type LiveStreamType = 'live' | 'upcoming' | 'none'
  const liveStreamType: LiveStreamType = resJson.items[0].snippet.liveBroadcastContent
  const latestMovieIDList = fs.readFileSync('movie-id', 'utf-8').split(',')

  for (const item of latestMovieIDList) {
    // 既に取得済みかどうか
    if (videoID === item)
      return
    // 配信の場合開始していないかどうか
    if (liveStreamType === 'upcoming')
      return
  }

  // 取得ログ更新
  const ary: string[] = []
  for (let i = 0; i < 5; i++) {
    ary.push(youtubeDataRes.items[i].snippet.resourceId.videoId)
  }
  fs.writeFileSync('movie-id', ary.join(','))

  return {
    title: resJson.items[0].snippet.title,
    url: `https://youtu.be/${resJson.items[0].id}`,
    thumbnailUrl: resJson.items[0].snippet.thumbnails.maxres.url,
    isLiveStream: liveStreamType === 'live',
  }
}
