const Discord = require('discord.js');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

var BUFF_EXTRACTION = require('../../constants/buff-extraction.js');
const API = require('../../constants/api.js');
const ERROR = require('../../constants/error-message.js');

function generateItemName(itemName) {
  return itemName;
}

function generateItemType(itemType) {
  switch (itemType) {
    case 170:
      return 'Weapon - Spear';
    case 180:
      return 'Weapon - Sword';
    case 190:
      return 'Weapon - Staff';
    case 210:
      return 'Weapon - Bow'
    case 220:
      return 'Weapon - Mace';
    case 230:
      return 'Weapon - Axe';
    case 250:
      return 'Weapon - Dagger';
    case 290:
      return 'Weapon -Knuckle';
    case 500:
      return 'Armor';
    case 510:
      return 'Offhand';
  }
}

function getExtractionList() {
  return axios.default.get(API.URL.EXTRACTION_BUFF)
    .then((response) => {
      const listItem = response.data || [];
      const sortedList = listItem.sort((itemA, itemB) => itemA[2].localeCompare(itemB[2]));

      let messageList = ``;


      sortedList.forEach((item) => {
        var itemName = item[2];

        messageList += '- ' + generateItemName(itemName) + `\n`;
      });

      const buffExtractionList = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Buff Extraction List')
        .setDescription(messageList)
        .setTimestamp();

      return {
        embeds: [buffExtractionList]
      };
    })
    .catch(() => {
      return {
        content: ERROR.UNABLE_FETCH_DATA,
      };
    });
}

function searchExtractionItem(itemName) {
  const searchItemName = itemName.toLowerCase();

  if (!searchItemName) return ERROR.EMPTY_ITEM_NAME;
  else {
    return axios.default.get(API.URL.EXTRACTION_BUFF)
      .then((response) => {
        let listItem = response.data || [];

        let maxScore = 0;
        let result = [];

        listItem.forEach(item => {
          const currentItemName = item[2].toLowerCase();
          let score = stringSimilarity.compareTwoStrings(currentItemName, searchItemName);

          if (maxScore < score) {
            maxScore = score;
            result = item;
          }
        });

        if (maxScore === 0) return {
          content: 'List extraction item is not found, please check on extraction list'
        };
        else {
          var itemId = result[0];
          var itemName = result[2];
          var itemDescription = result[3];
          var itemType = result[4];

          const buffExtraction = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${itemName}`)
            .setDescription(`${generateItemType(itemType)}
  
              **Buff Extraction Effect :**
              ${itemDescription}
            `)
            .setThumbnail(API.URL.GET_ITEM_ICON_BY_ID(itemId))
            .setTimestamp();

          return {
            embeds: [buffExtraction]
          };
        }

      })
      .catch(() => {
        return {
          content: ERROR.UNABLE_FETCH_DATA
        };
      });
  }
}

function sendHelpExtractionMessage(message) {
  message.channel.send('Please input the item name. **Format:*** `!extract {item_name}`\nTo check other commands try using `&help`');
}

module.exports = {
  generateItemName,
  generateItemType,
  getExtractionList,
  searchExtractionItem,
  sendHelpExtractionMessage,
}