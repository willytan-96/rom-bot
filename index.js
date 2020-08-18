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
    - !extract **{item_name}**
  `,
  EXTRACT: '!extract ',
  EXTRACTION_LIST: '!list-extract'
}

function getExtractionList(message) {
  axios.default.get('https://www.romcodex.com/api/extraction-buff')
    .then((response) => {
      let listItem = response.data || [];

      let messageList = ``;
      
      listItem.forEach((item) => {
        var itemName = item[2];
        
        messageList += '- ' + itemName + `\n`;
      });

      const buffExtractionList = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Buff Extraction List')
        .setDescription(messageList)
        .setTimestamp();

      message.channel.send(buffExtractionList);
    })
    .catch(() => {
      message.channel.send('Failed to fetch data :(');
    });
}

function searchExtractionItem(message) {
  var searchMessage = message.content.split(COMMANDS.EXTRACT);
  var itemName = searchMessage[1].toLowerCase();
  
  if (!!itemName) {
    axios.default.get('https://www.romcodex.com/api/extraction-buff')
      .then((response) => {
        let listItem = response.data || [];
        
        const filteredItems = listItem.filter((item) => {
          const currentItemName = item[2].toLowerCase();
          return currentItemName.includes(itemName)
        });

        if (!!filteredItems) {
          filteredItems.forEach(filteredItem => {
            var itemId = filteredItem[0];
            var itemName = filteredItem[2];
            var itemDescription = filteredItem[3];
            
            const buffExtraction = new Discord.RichEmbed()
              .setColor('#0099ff')
              .setTitle('Buff Extraction')
              .setDescription(`
                **Search result :**
                ${itemName}

                **Effect:**
                ${itemDescription}
              `)
              .setThumbnail(`https://www.romcodex.com/icons/item/item_${itemId}.png`)
              .setTimestamp();

            message.channel.send(buffExtraction);
          });
        } else {
          message.channel.send(`Search result for item **${searchMessage[1]}** is not found.
            Please check item list on: !list-extract
          `)
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
  console.log('I am ready!');
});

client.on('message', (message) => {
  if(message.content.startsWith(COMMANDS.EXTRACT)) {
    searchExtractionItem(message);
  } else if(message.content.startsWith(COMMANDS.EXTRACTION_LIST)) {
    getExtractionList(message)
  } else if (message.content.startsWith(COMMANDS.HELP)) {
    sendHelp(message);
  }
});

client.login(process.env.CLIENT_SECRET_TOKEN);