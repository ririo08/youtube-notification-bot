import { CONFIG } from '../setting'
import { postPhotoToBluesky } from './bluesky'
import { sendDiscordWebhook } from './discord'
import { deleteFile, downloadImage, jpgToBlob } from './utils/image'
import { getNewVideo } from './youtube'

export async function runBot() {
  const youTubeResponse = await getNewVideo()

  if (!youTubeResponse)
    return undefined

  console.log('新動画取得: ', youTubeResponse.title)
  console.log(youTubeResponse)

  // 画像取得
  const imagePath = './tmp-image.jpg'
  await downloadImage(youTubeResponse.thumbnailUrl, imagePath)

  // Discord投稿
  if (CONFIG.discord) {
    await sendDiscordWebhook(youTubeResponse)
  }

  // Bluesky投稿
  if (CONFIG.bluesky) {
    const blob = await jpgToBlob(imagePath)
    await postPhotoToBluesky({ ...youTubeResponse, blob })
  }

  // 画像削除
  deleteFile(imagePath)
}
