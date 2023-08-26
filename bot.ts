import * as fs from 'fs-extra';
import { format } from 'date-fns';
import * as cron from 'node-cron';
import { YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY } from './setting';
import { main, logError } from './main';

const BaseLogic = async () => {
  console.log(`Start Running...`);
  const firstLoadYouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(firstLoadYouTubeURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).catch((e) => {
    throw e;
  });
  if (res.status !== 200) {
    throw new Error();
  }

  const resJson = await res.json();

  const ary: string[] = [];
  for (let i = 0; i < 5; i++) {
    ary.push(resJson.items[i].snippet.resourceId.videoId);
  }
  fs.writeFileSync('movieid', ary.join(','));

  cron.schedule('5,35 * * * * *', function () {
    main();
  });
};

const TryConnect = async () => {
  try {
    await BaseLogic();
  } catch (e) {
    console.error('TryConnect:', format(new Date(), 'yyyy-MM-dd HH:mm:ss'), e);
    setTimeout(() => {
      TryConnect();
    }, 1000 * 60);
  }
};
TryConnect();
