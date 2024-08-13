import consola from 'consola'
import { CONFIG } from '../setting'
import { postPhotoToBluesky } from './bluesky'
import { sendDiscordWebhook } from './discord'
import { postPhotoToMastodon } from './mastodon'
import { tweet } from './twitter'
import { deleteFile, downloadImage, jpgToBlob } from './utils/image'
import { getNewVideo } from './youtube'
import { checkNicoNicoNewUpdates } from './niconico'

export async function runBot(target: 'youtube' | 'niconico') {
  try {
    // 最新情報取得
    const res = target === 'youtube' ? await getNewVideo() : await checkNicoNicoNewUpdates()

    if (!res)
      return undefined

    consola.success('新動画取得: ', res.title)

    // 画像取得
    const imagePath = './tmp-image.jpg'
    await downloadImage(res.thumbnailUrl, imagePath)
    const blob = await jpgToBlob(imagePath)

    // Discord投稿
    if (CONFIG.discord) {
      try {
        await sendDiscordWebhook(res)
        consola.success('Discord投稿完了: ', res.title)
      }
      catch (e) {
        consola.error('Discord投稿失敗: ', res.title, e)
      }
    }

    // Bluesky投稿
    if (CONFIG.bluesky) {
      try {
        await postPhotoToBluesky({ ...res, blob })
        consola.success('Bluesky投稿完了: ', res.title)
      }
      catch (e) {
        consola.error('Bluesky投稿失敗: ', res.title, e)
      }
    }

    // Twitter投稿
    if (CONFIG.twitter) {
      try {
        await tweet({ ...res, image: imagePath })
        consola.success('Twitter投稿完了: ', res.title)
      }
      catch (e) {
        consola.error('Twitter投稿失敗: ', res.title, e)
      }
    }

    // Mastodon投稿
    if (CONFIG.mastodon) {
      try {
        await postPhotoToMastodon({ ...res, blob })
        consola.success('Mastodon投稿完了: ', res.title)
      }
      catch (e) {
        consola.error('Mastodon投稿失敗: ', res.title, e)
      }
    }

    // 画像削除
    deleteFile(imagePath)
  }
  catch (e) {
    consola.error(e)
  }
}
