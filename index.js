const express = require('express')
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Bot Code

const Discord = require('discord.js');
const client = new Discord.Client();
const axios =  require('axios');

require('dotenv').config();

const COMMANDS = {
  HELP: '&help',
  HELP_MESSAGE: `- !list-extract
    - !extract **{item_name (min_charaters: 5)}**
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
  const itemName = searchMessage[1].toLowerCase();
  if (itemName.length < 5) message.channel.send('Minimal character search is 5 characters');

  else if (itemName.length > 0) {
    axios.default.get('https://www.romcodex.com/api/extraction-buff')
      .then((response) => {
        let listItem = response.data || [];
        
        const filteredItems = listItem.filter((item) => {
          const currentItemName = item[2].toLowerCase();
          return generateItemName(currentItemName).includes(itemName)
        });

        if (filteredItems.length > 0) {
          filteredItems.forEach(filteredItem => {
            var itemId = filteredItem[0];
            var itemName = filteredItem[2];
            var itemDescription = filteredItem[3];
            var itemType = filteredItem[4];
            
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
          });
        } else {
          message.channel.send(`Please check item list on: !list-extract`)
        }
      })
      .catch(() => {
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