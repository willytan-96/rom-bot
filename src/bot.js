const Discord = require('discord.js');
const Interactions = require("discord-slash-commands-client");
const helpersInteractions = require('./helpers/interactions.js');
const GENERAL = require('./constants/general.js');
const BUFF_EXTRACTION = require('./constants/buff-extraction.js');
const EQUIPMENT_FILTERS = require('./constants/equipment-filters');
const CARD_FILTERS = require('./features/card-filters');
const BUFF_EXTRACTION_FEATURES = require('./features/buff-extraction');
const FURNITURE_FILTERS_FEATURES = require('./features/furniture-filters');
const EQUIPMENT_FILTERS_FEATURES = require('./features/equipment-filters');
const effectTypes = require('./constants/effect-types.js');

require('dotenv').config();

const client = new Discord.Client();

function sendHelp(message) {
  const helpMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help Support')
    .setDescription(GENERAL.HELP_MESSAGE)
    .setFooter('Not for sell, this bot is free')
    .setTimestamp();

  message.channel.send(helpMessage);
}

client.interactions = new Interactions.Client(process.env.CLIENT_SECRET_TOKEN, process.env.CLIENT_USER_ID);

client.on('ready', () => {
  client.user.setActivity('h: &help');


  const whitelistGuilds = []

  client.guilds.cache.map((_, key) => {
    let isRegisteredInWhitelist = false;
    if (whitelistGuilds.length > 0) {
      isRegisteredInWhitelist = whitelistGuilds.filter((value) => value.toString() === key.toString()).length > 0;
    } else {
      isRegisteredInWhitelist = true
    }
    

    if (isRegisteredInWhitelist) {
      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "help",
          description: "to show all commands that exist in Valkyrie's Bot"
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "extraction-buff-list",
          description: "to show all extraction buff item list"
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "deposit-card-effect-list",
          description: "to show all deposit card effect list"
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "deposit-furniture-effect-list",
          description: "to show all deposit furniture effect list"
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "synthesis-equipment",
          description: "find synthesis equipment requirement material",
          options: [{
            name: "item_name",
            description: "Name of the weapon / armow that want to be looking for",
            required: true,
            type: 3
          }]
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "extract",
          description: "Find extraction buff of an item",
          options: [
            {
              name: "item_name",
              description: "Name of the extraction buff item",
              type: 3,
              required: true,
            }
          ]
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "search-depo-card-effect-list",
          description: "Find deposit card effect list",
          options: [
            {
              name: "effect_status",
              description: "Effect of card (Will always priority checking this first and ignore the second one if exist)",
              type: 3,
              required: false,
              choices: effectTypes.listStatus.map(({ title, value }) => ({
                name: title,
                value
              }))
            }, {
              name: "effect_percentage",
              description: "Effect % of card",
              type: 3,
              required: false,
              choices: effectTypes.listPercentageStatus.map(({ title, value }) => ({
                name: title,
                value
              }))
            },
          ]
        },
      });

      client.api.applications(process.env.CLIENT_USER_ID).guilds(key).commands.post({
        data: {
          name: "search-furniture-effect-list",
          description: "Find deposit furniture effect list",
          options: [
            {
              name: "effect_status",
              description: "Effect deposit furniture",
              type: 3,
              required: true,
              choices: effectTypes.furnitureEffectTypes.map(({ title, value }) => ({
                name: title,
                value
              }))
            },
          ]
        },
      });
    }
  })

  client.ws.on('INTERACTION_CREATE', async interaction => {
    // console.log(interaction);
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    const discordClients = client.api.interactions(interaction.id, interaction.token);
    if (command === 'help') {
      helpersInteractions.sendHelpMessage(discordClients);
    } else if (command === 'extract') {
      const itemName = args[0].value;
      const searchItemResult = await BUFF_EXTRACTION_FEATURES.searchExtractionItem(itemName);
      helpersInteractions.sendMessage(discordClients, searchItemResult);
    } else if (command === 'extraction-buff-list') {
      const result = await BUFF_EXTRACTION_FEATURES.getExtractionList();
      helpersInteractions.sendMessage(discordClients, result);
    } else if (command === 'deposit-card-effect-list') {
      const result = await CARD_FILTERS.sendEffectList();
      helpersInteractions.sendMessage(discordClients, result);
    } else if (command === 'search-depo-card-effect-list') {
      const value = args[0].value;
      console.log(args, value);
      const result = await CARD_FILTERS.getListDepoCard(value);
      helpersInteractions.sendMessage(discordClients, result);

    } else if (command === 'synthesis-equipment') {
      const value = args[0].value;
      console.log("args", args)
      const result = await EQUIPMENT_FILTERS_FEATURES.synthesisEquipment(value);
      helpersInteractions.sendMessage(discordClients, result);
    } else if (command === 'deposit-furniture-effect-list') {
      const result = await FURNITURE_FILTERS_FEATURES.sendEffectList();
      helpersInteractions.sendMessage(discordClients, result);
    } else if (command === 'search-furniture-effect-list') {
      const value = args[0].value;
      const result = await FURNITURE_FILTERS_FEATURES.getListDepoFurnitures(value);
      helpersInteractions.sendMessage(discordClients, result);
    }
  });

  console.log("Bot is ready !!")
});

// client.user.setActivity("`or any information : &help"); 

client.on('message', (message) => {
  // if (message.content.startsWith(BUFF_EXTRACTION.EXTRACT)) {
  //   BUFF_EXTRACTION_FEATURES.searchExtractionItem(message);
  // } else if (message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_LIST)) {
  //   BUFF_EXTRACTION_FEATURES.getExtractionList(message)
  // } else if (message.content.startsWith(BUFF_EXTRACTION.EXTRACTION_HELP)) {
  //   BUFF_EXTRACTION_FEATURES.sendHelpExtractionMessage(message);
  // } else if (message.content.startsWith(GENERAL.HELP)) {
  //   sendHelp(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_CARD_LIST)) {
  //   CARD_FILTERS.sendEffectList(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_CARD)) {
  //   CARD_FILTERS.getListDepoCard(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_CARD_HELP)) {
  //   CARD_FILTERS.sendHelpAdvBookCard(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE_LIST)) {
  //   FURNITURE_FILTERS_FEATURES.sendEffectList(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE)) {
  //   FURNITURE_FILTERS_FEATURES.getListDepoFurnitures(message);
  // } else if (message.content.startsWith(GENERAL.DEPO_FURNITURE_HELP)) {
  //   FURNITURE_FILTERS_FEATURES.sendHelpAdvBookFurnitures(message);
  // } else if (message.content.startsWith(EQUIPMENT_FILTERS.SYNTHESIS)) {
  //   EQUIPMENT_FILTERS_FEATURES.synthesisEquipment(message);
  // }
});

client.login(process.env.CLIENT_SECRET_TOKEN);