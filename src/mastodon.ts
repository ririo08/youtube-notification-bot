import { createRestAPIClient } from 'masto'
import { MASTODON_ACCESS_TOKEN, MASTODON_INSTANCE_URL } from '../setting'

interface PostMastodonRequest {
  title: string
  url: string
  blob: Blob
  isLiveStream: boolean
}

export async function postPhotoToMastodon(request: PostMastodonRequest) {
  // クライアント作成
  const masto = createRestAPIClient({
    url: MASTODON_INSTANCE_URL,
    accessToken: MASTODON_ACCESS_TOKEN,
  })

  // 画像アップロード
  const uploadImage = async () => {
    const response = await masto.v1.media.create({
      // FIXME: Bunだとこうしないとダメらしい https://github.com/neet/masto.js/issues/1054
      file: new Blob([Bun.file('./tmp-image.jpg')]) as Blob,
    })
    return response.id
  }

  // トゥート
  const postToot = async (status: string) => {
    const mediaId = await uploadImage()
    await masto.v1.statuses.create({
      status,
      mediaIds: [mediaId],
    })
  }

  // テキスト作成
  const prefix = request.isLiveStream ? '🔔配信開始' : '🎬動画投稿'
  const text = `${prefix}\n\n${request.title}\n${request.url}`

  await postToot(text)
}
