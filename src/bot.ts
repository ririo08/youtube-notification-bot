import consola from 'consola'
import { CONFIG } from '../setting'
import { postPhotoToBluesky } from './bluesky'
import { sendDiscordWebhook } from './discord'
import { postPhotoToMastodon } from './mastodon'
import { tweet } from './twitter'
import { deleteFile, downloadImage, jpgToBlob } from './utils/image'
import { getNewVideo } from './youtube'

export async function runBot() {
  try {
    const youTubeResponse = await getNewVideo()

    if (!youTubeResponse)
      return undefined

    consola.success('新動画取得: ', youTubeResponse.title)

    // 画像取得
    const imagePath = './tmp-image.jpg'
    await downloadImage(youTubeResponse.thumbnailUrl, imagePath)
    const blob = await jpgToBlob(imagePath)

    // Discord投稿
    if (CONFIG.discord) {
      try {
        await sendDiscordWebhook(youTubeResponse)
        consola.success('Discord投稿完了: ', youTubeResponse.title)
      }
      catch (e) {
        consola.error('Discord投稿失敗: ', youTubeResponse.title, e)
      }
    }

    // Bluesky投稿
    if (CONFIG.bluesky) {
      try {
        await postPhotoToBluesky({ ...youTubeResponse, blob })
        consola.success('Bluesky投稿完了: ', youTubeResponse.title)
      }
      catch (e) {
        consola.error('Bluesky投稿失敗: ', youTubeResponse.title, e)
      }
    }

    // Twitter投稿
    if (CONFIG.twitter) {
      try {
        await tweet(youTubeResponse)
        consola.success('Twitter投稿完了: ', youTubeResponse.title)
      }
      catch (e) {
        consola.error('Twitter投稿失敗: ', youTubeResponse.title, e)
      }
    }

    // Mastodon投稿
    if (CONFIG.mastodon) {
      try {
        await postPhotoToMastodon({ ...youTubeResponse, blob })
        consola.success('Mastodon投稿完了: ', youTubeResponse.title)
      }
      catch (e) {
        consola.error('Mastodon投稿失敗: ', youTubeResponse.title, e)
      }
    }

    // 画像削除
    deleteFile(imagePath)
  }
  catch (e) {
    consola.error(e)
  }
}
