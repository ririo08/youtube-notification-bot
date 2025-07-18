import { TwitterApi } from 'twitter-api-v2'
import { TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_API_KEY, TWITTER_API_KEY_SECRET } from '../setting'

interface TweetRequest {
  title: string
  url: string
  isLiveStream: boolean
  image: string
}

export async function tweet(request: TweetRequest) {
  const twitterClient = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_KEY_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  })

  const rwClient = twitterClient.readWrite

  const mediaId = await rwClient.v1.uploadMedia(request.image)

  // 投稿文の作成
  const prefix = request.isLiveStream ? '🔔配信開始' : '🎬動画投稿'

  // 画像付きのタイトルだけを最初にツイート
  const firstTweetText = `${prefix}\n\n${request.title}`
  const tweetRes = await rwClient.v2.tweet(firstTweetText, { media: { media_ids: [mediaId] } })

  // そのツイートへのリプライで動画URLを送信
  const replyText = `動画はこちら！\n${request.url}`
  await rwClient.v2.reply(replyText, tweetRes.data.id)
}
