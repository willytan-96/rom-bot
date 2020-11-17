const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const GENERAL = require('./constants/general.js');

const BUFF_EXTRACTION = require('./constants/buff-extraction.js');
const EQUIPMENT_FILTERS = require('./constants/equipment-filters');
const CARD_FILTERS = require('./features/card-filters');
const BUFF_EXTRACTION_FEATURES = require('./features/buff-extraction');
const FURNITURE_FILTERS_FEATURES = require('./features/furniture-filters');
const EQUIPMENT_FILTERS_FEATURES = require('./features/equipment-filters');

function sendHelp(message) {
  const helpMessage = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Help Support')
    .setDescription(GENERAL.HELP_MESSAGE)
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
    FURNITURE_FILTERS_FEATURES.sendEffectList(message);
  } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE)) {
    FURNITURE_FILTERS_FEATURES.getListDepoFurnitures(message);
  } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE_HELP)) {
    FURNITURE_FILTERS_FEATURES.sendHelpAdvBookFurnitures(message);
  } else if (message.content.startsWith(EQUIPMENT_FILTERS.SYNTHESIS)) {
    EQUIPMENT_FILTERS_FEATURES.synthesisEquipment(message);
  }
});

client.login(process.env.CLIENT_SECRET_TOKEN);