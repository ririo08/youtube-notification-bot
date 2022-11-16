import fs from 'fs-extra'
import { Client, GatewayIntentBits } from 'discord.js'
import cron from "node-cron"
import { TOKEN, PLAYLIST_ID, YOUTUBE_API_KEY } from "./setting.js"
import { main } from "./main.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', client => {
  console.log(`Logged in as ${client.user.tag}!`);
  const firstLoadYouTubeURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
  fetch(firstLoadYouTubeURL, { method: "GET", headers: { 'Content-Type': 'application/json' } }).then((v) => {
    v.json().then((res) => {
      let ary = []
      for (let i = 0; i < 5; i++) {
        ary.push(res.items[i].snippet.resourceId.videoId)
      }
      fs.writeFileSync("movieid", ary.join(','))
    })
  })
  cron.schedule('5,35 * * * * *', function () {
    main(client)
  });
});
client.login(TOKEN);