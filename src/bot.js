const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const GENERAL = require('./constants/general.js');

const BUFF_EXTRACTION_FEATURES = require('./features/buff-extraction');
const BUFF_EXTRACTION = require('./constants/buff-extraction.js');
const CARD_FILTERS = require('./features/card-filters');
const FURNITURE_FILTERS = require('./features/furniture-filters');

function sendHelp(message) {
  const helpMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help Support')
    .setDescription(GENERAL.HELP_MESSAGE)
    .setFooter('Not for sell, this bot is free')
    .setTimestamp();

  message.channel.send(helpMessage);
}

client.on('ready', () => {
  client.user.setActivity('h: &help')
  console.log('I am ready!');
});

// client.user.setActivity("`or any information : &help"); 

client.on('message', (message) => {
  if (message.content.startsWith(BUFF_EXTRACTION.EXTRACT)) {
    BUFF_EXTRACTION_FEATURES.searchExtractionItem(message);
  } else if (message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_LIST)) {
    BUFF_EXTRACTION_FEATURES.getExtractionList(message)
  } else if (message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_HELP)) {
    BUFF_EXTRACTION_FEATURES.sendHelpExtractionMessage(message);
  } else if (message.content.startsWith(GENERAL.HELP)) {
    sendHelp(message);
  } else if (message.content.startsWith(GENERAL.DEPO_CARD_LIST)) {
    CARD_FILTERS.sendEffectList(message);
  } else if (message.content.startsWith(GENERAL.DEPO_CARD)) {
    CARD_FILTERS.getListDepoCard(message);
  } else if (message.content.startsWith(GENERAL.DEPO_CARD_HELP)) {
    CARD_FILTERS.sendHelpAdvBookCard(message);
  } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE_LIST)) {
    FURNITURE_FILTERS.sendEffectList(message);
  } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE)) {
    FURNITURE_FILTERS.getListDepoFurnitures(message);
  } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE_HELP)) {
    FURNITURE_FILTERS.sendHelpAdvBookFurnitures(message);
  }
});

client.login(process.env.CLIENT_SECRET_TOKEN);