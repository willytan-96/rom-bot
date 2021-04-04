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
    const commands = [
      "list extract",
      "depo card ***{effect}***",
      "depo card  ***{effect_name}***",
      "depo card list",
      "depo furniture  ***{effect_name}***",
      "depo furniture list",
      "synth ***{item_name}***"
    ]

    let message = "";
    message += "Here list of the commands :\n"
    commands.forEach((value) => {
      message += `\t- ${value}\n`
    })

    const embeedMessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('List commands :')
      .setDescription(message)
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