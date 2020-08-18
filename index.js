const express = require('express')
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, '0.0.0.0', () => console.log(`Example app listening at http://0.0.0.0:${port}`))

// Bot Code

const Discord = require('discord.js');
const client = new Discord.Client();
const axios =  require('axios');
const stringSimilarity = require('string-similarity');

require('dotenv').config();

const COMMANDS = {
  HELP: '&help',
  HELP_MESSAGE: `- !list-extract
    - !extract **{item_name}**
  `,
  EXTRACT: '!extract ',
  EXTRACT_HELP: '!extract',
  EXTRACTION_LIST: '!list-extract'
}

function generateItemName(itemName) {
  return itemName;
}

function generateItemType(itemType) {
  switch (itemType) {
    case 170: return 'Weapon - Spear';
    case 180: return 'Weapon - Sword';
    case 190: return 'Weapon - Staff';
    case 210: return 'Weapon - Bow'
    case 220: return 'Weapon - Mace';
    case 230: return 'Weapon - Axe';
    case 250: return 'Weapon - Dagger';
    case 290: return 'Weapon -Knuckle';
    case 500: return 'Armor';
    case 510: return 'Offhand';
  }
}

function getExtractionList(message) {
  axios.default.get('https://www.romcodex.com/api/extraction-buff')
    .then((response) => {
      const listItem = response.data || [];
      const sortedList = listItem.sort((itemA, itemB) => itemA[2].localeCompare(itemB[2]));

      let messageList = ``;


      sortedList.forEach((item) => {
        var itemName = item[2];
        
        messageList += '- ' + generateItemName(itemName) + `\n`;
      });

      const buffExtractionList = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Buff Extraction List')
        .setDescription(messageList)
        .setFooter('Note: Kalau rusak cari GloomyLord')
        .setTimestamp();

      message.channel.send(buffExtractionList);
    })
    .catch(() => {
      message.channel.send('Failed to fetch data :(');
    });
}

function searchExtractionItem(message) {
  const searchMessage = message.content.split(COMMANDS.EXTRACT);
  const searchItemName = searchMessage[1].toLowerCase();

  if (searchItemName.length > 0) {
    axios.default.get('https://www.romcodex.com/api/extraction-buff')
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

        if (maxScore === 0) message.channel.send('List extraction item is not found, please check on `!list-extract`');
        else {
          var itemId = result[0];
          var itemName = result[2];
          var itemDescription = result[3];
          var itemType = result[4];
          
          const buffExtraction = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(`${itemName}`)
            .setDescription(`${generateItemType(itemType)}
  
              **Buff Extraction Effect :**
              ${itemDescription}
            `)
            .setThumbnail(`https://www.romcodex.com/icons/item/item_${itemId}.png`)
            .setTimestamp();
  
          message.channel.send(buffExtraction);
        }
        
      })
      .catch((err) => {
        console.log(err);
        message.channel.send('Failed to fetch data :(');
      });
    } else {
      message.channel.send('Item message not inputed ! Yang betol lha!')
    }
}

function sendHelp(message) {
  const helpMessage = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Help Support')
    .setDescription(COMMANDS.HELP_MESSAGE)
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
  if(message.content.startsWith(COMMANDS.EXTRACT)) {
    searchExtractionItem(message);
  } else if(message.content.startsWith(COMMANDS.EXTRACTION_LIST)) {
    getExtractionList(message)
  } else if (message.content.startsWith(COMMANDS.HELP)) {
    sendHelp(message);
  } else if (message.content.startsWith(COMMANDS.EXTRACT_HELP)) {
    message.channel.send('Please input the item name. **Format:*** `!extract {item_name}`\nTo check other commands try using `&help`')
  }
});

client.login(process.env.CLIENT_SECRET_TOKEN);