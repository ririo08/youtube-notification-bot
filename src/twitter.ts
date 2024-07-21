import { TwitterApi } from 'twitter-api-v2'
import { TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_API_KEY, TWITTER_API_KEY_SECRET } from '../setting'

interface TweetRequest {
  title: string
  url: string
  isLiveStream: boolean
}

export async function tweet(request: TweetRequest) {
  const twitterClient = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_KEY_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  })

  const rwClient = twitterClient.readWrite

  // 投稿文の作成
  const prefix = request.isLiveStream ? '🔔配信開始' : '🎬動画投稿'
  const text = `${prefix}\n\n${request.title}\n${request.url}`

  await rwClient.v2.tweet(text, {})
}
