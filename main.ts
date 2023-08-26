import * as fs from 'fs-extra';
import { format } from 'date-fns';
import {
  YOUTUBE_PLAYLIST_ID,
  YOUTUBE_API_KEY,
  DISCORD_WEBHOOK_URL_MOVIE,
  DISCORD_WEBHOOK_URL_LIVE,
} from './setting';

export const main = async () => {
  // YouTube Data API
  const YouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;

  // 最新動画取得
  const youtubeDataResFetch = await fetch(YouTubeURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((e) => {
    logError('ライブ情報取得', e);
  });
  if (typeof youtubeDataResFetch === 'undefined') return;
  if (youtubeDataResFetch.status !== 200) {
    logError('最新動画取得 ログ取得エラー', youtubeDataResFetch.status);
    return;
  }

  const youtubeDataRes = await youtubeDataResFetch.json();
  const videoID = youtubeDataRes.items[0].snippet.resourceId.videoId;
  const title = youtubeDataRes.items[0].snippet.title;

  // ライブ情報取得
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${YOUTUBE_API_KEY}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  ).catch((e) => {
    logError('ライブ情報取得', e);
  });
  if (typeof res === 'undefined') return;
  if (res.status !== 200) {
    logError('ライブ情報取得 ログ取得エラー', res.status);
    return;
  }

  const resJson = await res.json();

  const isLiveStream = resJson.items[0].snippet.liveBroadcastContent;
  const latestMovieIDList = fs.readFileSync('movieid', 'utf-8').split(',');
  for (const item of latestMovieIDList) {
    if (videoID === item) return;
    if (isLiveStream === 'upcoming') return;
  }
  console.log('run: ', title);

  // ファイル更新
  const ary: string[] = [];
  for (let i = 0; i < 5; i++) {
    ary.push(youtubeDataRes.items[i].snippet.resourceId.videoId);
  }
  fs.writeFileSync('movieid', ary.join(','));

  // チャット送信
  if (isLiveStream === 'live') {
    const req = {
      content: `🔔 配信開始\n\n${title}\nhttps://youtu.be/${videoID}`,
    };
    await fetch(DISCORD_WEBHOOK_URL_LIVE, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: { 'Content-Type': 'application/json' },
    }).catch((e) => {
      logError('チャット送信', e);
    });
  } else {
    const req = {
      content: `🎬 動画投稿\n\n${title}\nhttps://youtu.be/${videoID}`,
    };
    await fetch(DISCORD_WEBHOOK_URL_MOVIE, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: { 'Content-Type': 'application/json' },
    }).catch((e) => {
      logError('チャット送信', e);
    });
  }
};

export const logError = (errorMessage: string, e: any = null) => {
  console.error(
    errorMessage + ': ',
    format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    e
  );
};
