import * as fs from 'fs-extra'
import consola from 'consola'
import { ofetch } from 'ofetch'
import { NICONICO_USER_ID } from '../setting'
import type { SearchNicoNicoLiveResponse, SearchNicoNicoMovieResponse } from './types/niconico'

interface NicoNicoResponse {
  title: string
  url: string
  thumbnailUrl: string
  isLiveStream: boolean
}

async function getNicoNicoVideo() {
  const res = await ofetch<SearchNicoNicoMovieResponse>(`https://nvapi.nicovideo.jp/v3/users/${NICONICO_USER_ID}/videos`, {
    method: 'GET',
    query: {
      sortKey: 'registeredAt',
      sortOrder: 'desc',
      sensitiveContents: 'mask',
      pageSize: 5,
      page: 1,
    },
    headers: {
      'x-frontend-id': '6',
      'x-frontend-version': '0',
      'x-niconico-language': 'ja-jp',
    },
  })
  return res
}

async function getNicoNicoStream() {
  const res = await ofetch<SearchNicoNicoLiveResponse>('https://live.nicovideo.jp/front/api/v1/user-broadcast-history', {
    method: 'GET',
    query: {
      providerId: NICONICO_USER_ID,
      providerType: 'user',
      isIncludeNonPublic: false,
      offset: 0,
      limit: 5,
      withTotalCount: true,
    },
  })
  return res
}

async function checkNicoNicoNewUpdates() {
  try {
    const videos = await getNicoNicoVideo()
    const streams = await getNicoNicoStream()
    const latestVideoIds = videos.data.items.map(m => m.essential.id)
    const latestStreamIds = streams.data.programsList.map(m => m.id.value)
    const latestMovieIdList = getNicoVideoIds()
    const latestStreamIdList = getNicoStreamIds()

    if (!latestMovieIdList.includes(latestVideoIds[0])) {
      const latestVideo = videos.data.items[0]
      const res: NicoNicoResponse = {
        title: latestVideo.essential.title,
        url: `https://www.nicovideo.jp/watch/${latestVideo.essential.id}`,
        thumbnailUrl: latestVideo.essential.thumbnail.nHdUrl,
        isLiveStream: false,
      }
      setNicoVideoIds(latestVideoIds)
      return res
    }
    else if (!latestStreamIdList.includes(latestStreamIds[0])) {
      const latestStream = streams.data.programsList[0]
      const res: NicoNicoResponse = {
        title: latestStream.program.title,
        url: `https://live.nicovideo.jp/watch/${latestStream.id.value}`,
        thumbnailUrl: latestStream.thumbnail.listing.large.value ?? latestStream.thumbnail.screenshot.large,
        isLiveStream: true,
      }
      setNicoStreamIds(latestStreamIds)
      return res
    }
    else {
      return undefined
    }
  }
  catch (e) {
    consola.error('ニコニコ最新情報取得失敗', e)
    return undefined
  }
}

function getNicoVideoIds() {
  return fs.readFileSync('_temp/nico-video', 'utf-8').split(',')
}

function getNicoStreamIds() {
  return fs.readFileSync('_temp/nico-stream', 'utf-8').split(',')
}

function setNicoVideoIds(latestVideoIds: string[]) {
  fs.writeFileSync('_temp/nico-video', latestVideoIds.join(','))
}

function setNicoStreamIds(latestStreamIds: string[]) {
  fs.writeFileSync('_temp/nico-stream', latestStreamIds.join(','))
}

export {
  getNicoNicoVideo,
  getNicoNicoStream,
  checkNicoNicoNewUpdates,
  getNicoVideoIds,
  getNicoStreamIds,
  setNicoVideoIds,
  setNicoStreamIds,
}
