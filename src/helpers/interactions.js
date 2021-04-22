const Discord = require('discord.js');

module.exports = {
  sendMessage: (DiscordClient, requestPayload) => {
    console.log("Req payload", requestPayload)
    DiscordClient.callback.post({
      data: {
        type: 4,
        data: requestPayload
      }
    })
  },
  sendHelpMessage: (DiscordClient) => {
    const embeedMessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help')
      .setDescription('All commands is already registered in `/` slash commands of discord. try to type `/` and you`re able to see it on there.')
      .setTimestamp();


    DiscordClient.callback.post({
      data: {
        type: 4,
        data: {
          embeds: [embeedMessage]
        }
      }
    })
  }
}