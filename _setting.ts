/** 設定 trueにすると動きます。動かす場合は各種キーが必要です。 */
const CONFIG = {
  discord: true,
  bluesky: true,
  twitter: true,
}

// ------------------------------------------------------------

// 下の項目の''の中に、各URL・キーを設定して保存してください
// 設定後、ファイル名の_(アンダーバー)を削除してください

/** YouTube API Key */
const YOUTUBE_API_KEY = ''

/** 対象チャンネルの全ての動画の再生リストID */
const YOUTUBE_PLAYLIST_ID = ''

// 以下DiscordのURLは、同じチャンネルを使う場合は同じURLを指定してください

/** Discord Webhook URL (動画) */
const DISCORD_WEBHOOK_URL_MOVIE = ''
/** Discord Webhook URL (配信) */
const DISCORD_WEBHOOK_URL_LIVE = ''

/** AT ProtocolのURL（デフォはこのままでOK） */
const BLUESKY_BASE_URL = 'https://bsky.social'

/** 投稿するアカウントのID (ex: ririo08.bsky.social) */
const BLUESKY_USER_ID = ''

/** BlueskyのApp Password */
const BLUESKY_APP_PASSWORD = ''

const TWITTER_API_KEY = ''
const TWITTER_API_KEY_SECRET = ''
const TWITTER_ACCESS_TOKEN = ''
const TWITTER_ACCESS_TOKEN_SECRET = ''

// ------------------------------------------------------------

// 以下は書き換えないでください
export {
  CONFIG,
  YOUTUBE_API_KEY,
  YOUTUBE_PLAYLIST_ID,
  DISCORD_WEBHOOK_URL_MOVIE,
  DISCORD_WEBHOOK_URL_LIVE,
  BLUESKY_BASE_URL,
  BLUESKY_USER_ID,
  BLUESKY_APP_PASSWORD,
  TWITTER_API_KEY_SECRET,
  TWITTER_API_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
}
