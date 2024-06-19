import { CONFIG } from '../setting'
import { postPhotoToBluesky } from './bluesky'
import { sendDiscordWebhook } from './discord'
import { postPhotoToMastodon } from './mastodon'
import { tweet } from './twitter'
import { deleteFile, downloadImage, jpgToBlob } from './utils/image'
import { getNewVideo } from './youtube'

export async function runBot() {
  const youTubeResponse = await getNewVideo()

  if (!youTubeResponse)
    return undefined

  console.log('新動画取得: ', youTubeResponse.title)

  // 画像取得
  const imagePath = './tmp-image.jpg'
  await downloadImage(youTubeResponse.thumbnailUrl, imagePath)
  const blob = await jpgToBlob(imagePath)

  // Discord投稿
  if (CONFIG.discord) {
    await sendDiscordWebhook(youTubeResponse)
  }

  // Bluesky投稿
  if (CONFIG.bluesky) {
    await postPhotoToBluesky({ ...youTubeResponse, blob })
  }

  // Twitter投稿
  if (CONFIG.twitter) {
    await tweet(youTubeResponse)
  }

  // マストドン投稿
  if (CONFIG.mastodon) {
    await postPhotoToMastodon({ ...youTubeResponse, blob })
  }

  // 画像削除
  deleteFile(imagePath)
}

runBot()
