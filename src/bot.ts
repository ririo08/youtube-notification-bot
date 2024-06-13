import { sendDiscordWebhook } from './discord'
import { getNewVideo } from './youtube'

export async function runBot() {
  const youTubeResponse = await getNewVideo()

  if (!youTubeResponse)
    return undefined

  console.log('新動画取得: ', youTubeResponse.title)

  // discord投稿
  await sendDiscordWebhook(youTubeResponse)
}
