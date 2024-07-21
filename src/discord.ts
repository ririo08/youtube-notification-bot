import {
  DISCORD_WEBHOOK_URL_LIVE,
  DISCORD_WEBHOOK_URL_MOVIE,
} from '../setting'

interface DiscordWebhookRequest {
  isLiveStream: boolean
  title: string
  url: string
}

export async function sendDiscordWebhook(request: DiscordWebhookRequest) {
  // チャット送信
  if (request.isLiveStream) {
    const req = {
      content: `🔔 配信開始\n\n${request.title}\n${request.url}`,
    }
    await fetch(DISCORD_WEBHOOK_URL_LIVE, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      throw new Error('チャット送信失敗')
    })
  }
  else {
    const req = {
      content: `🎬 動画投稿\n\n${request.title}\n${request.url}`,
    }
    await fetch(DISCORD_WEBHOOK_URL_MOVIE, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      throw new Error('チャット送信失敗')
    })
  }
}
