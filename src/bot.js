const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const GENERAL = require('./constants/general.js');

const BUFF_EXTRACTION_FEATURES = require('./features/buff-extraction');
const BUFF_EXTRACTION = require('./constants/buff-extraction.js');

function sendHelp(message) {
  const helpMessage = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Help Support')
    .setDescription(BUFF_EXTRACTION.HELP_MESSAGE)
    .setFooter('Note: Kalau rusak cari GloomyLord')
    .setTimestamp();

  message.channel.send(helpMessage);
}

client.on('ready', () => {
  client.user.setActivity('h: &help')
  console.log('I am ready!');
});

// client.user.setActivity("`or any information : &help"); 

client.on('message', (message) => {
  if(message.content.startsWith(BUFF_EXTRACTION.EXTRACT)) {
    BUFF_EXTRACTION_FEATURES.searchExtractionItem(message);
  } else if(message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_LIST)) {
    BUFF_EXTRACTION_FEATURES.getExtractionList(message)
  } else if (message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_HELP)) {
    BUFF_EXTRACTION_FEATURES.sendHelpExtractionMessage(message);
  } else if (message.content.startsWith(GENERAL.HELP)) {
    BUFF_EXTRACTION_FEATURES.sendHelp(message);
  } 
});

client.login(process.env.CLIENT_SECRET_TOKEN);