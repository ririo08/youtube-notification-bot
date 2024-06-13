import { BskyAgent, RichText } from '@atproto/api'
import { BLUESKY_APP_PASSWORD, BLUESKY_BASE_URL, BLUESKY_USER_ID } from '../setting'

// inspire from https://qiita.com/eXpresser/items/fce2066f442bd37c8a36

interface PostBlueskyRequest {
  title: string
  url: string
  blob: Blob
  isLiveStream: boolean
}

export async function postPhotoToBluesky(request: PostBlueskyRequest): Promise<void> {
  const agent = new BskyAgent({
    service: BLUESKY_BASE_URL,
  })

  // アプリパスワードを使用して Bluesky にログインする
  await agent.login({
    identifier: BLUESKY_USER_ID,
    password: BLUESKY_APP_PASSWORD,
  })

  // 画像をアップロードする
  // Blob型オブジェクトを Uint8Array に変換
  const dataArray: Uint8Array = new Uint8Array(await request.blob.arrayBuffer())
  const { data: result } = await agent.uploadBlob(
    dataArray,
    {
      // 画像の形式を指定 ('image/jpeg' 等の MIME タイプ)
      encoding: request.blob.type,
    },
  )

  // 投稿文の作成
  const prefix = request.isLiveStream ? '🔔配信開始' : '🎬動画投稿'
  const text = `${prefix}\n\n${request.title}\n${request.url}`

  // テキストをメンション、リンク、絵文字を含むリッチテキストに変換
  const rt = new RichText({
    text,
  })
  await rt.detectFacets(agent) // メンションやリンクを自動で検出する

  // 投稿を作成
  await agent.post({
    text: rt.text,
    facets: rt.facets,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          alt: 'YouTubeのサムネイル',
          image: result.blob, // 画像投稿時にレスポンスをここで渡すことにより、投稿と画像を紐付け
          aspectRatio: {
            width: 16,
            height: 9,
          },
        },
      ],
    },
    langs: ['ja-JP', 'en-US'],
    createdAt: new Date().toISOString(), // 投稿日時を指定する
  })
}
