const Discord = require('discord.js');
const axios = require('axios');
const general = require('../../constants/general');
const effectTypes = require('../../constants/effect-types');
const GENERAL = require('../../constants/general');
const ERROR = require('../../constants/error-message');
const API = require('../../constants/api');

require('dotenv').config();

function sendHelpAdvBookCard(message) {
  message.channel.send('Please input the item name. *Format:* `' + GENERAL.DEPO_CARD_HELP + ' {effect_name}`\nTo check other commands try using `&help`');
}

function sendEffectList() {
  let effectList = '';

  effectTypes.listTypes.forEach((effect, index) => {
    effectList += `${index + 1}. ${effect.title} \n`
  })

  const effectListMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`List Adventure Book Effects:`)
    .setDescription(effectList)
    .setTimestamp();

  return {
    embeds: [effectListMessage]
  }
}

function getListDepoCard(cardEffect) {
  const searchEffectValue = cardEffect.toLowerCase();
  const effect = effectTypes.listTypes.filter((eTypes) => eTypes.title.toLowerCase() === searchEffectValue);

  if (effect.length === 0) return {
    content: `Effect doesn't exist. Please check list effect !`
  };
  else {
    return axios.get(API.URL.CARDS)
      .then((response) => {
        const cards = response.data.filter(
          (e) => e[10].toLowerCase().includes(`"${effect[0].value.toLowerCase()}"`) ||
          e[11].toLowerCase().includes(`"${effect[0].value.toLowerCase()}"`)
        );

        if (cards.length === 0) return {
          content: `Card with effect : *${searchEffect[1]}* is not found !`
        };

        let listCard = [];
        let textListCard = '';

        const sortedCardList = cards.sort((cardA, cardB) => cardA[0].localeCompare(cardB[0]));

        sortedCardList.forEach((card, index) => {
          let temp = textListCard;
          temp += `- ${card[0]}\n`;

          if (temp.length >= 1990) {
            listCard.push(textListCard);
            textListCard = `- ${card[0]}\n`;
          } else {
            textListCard = temp;
          }

          if (index + 1 === cards.length) {
            listCard.push(textListCard);
          }
        })

        let listEmbeeds = [];
        listCard.forEach((value, index) => {
          const newEmbeeds = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Search result page - ${index} ::`)
            .setDescription(value)
          listEmbeeds.push(newEmbeeds)
        })


        return {
          embeds: listEmbeeds
        }
      }).catch(() => ({
        content: ERROR.UNABLE_FETCH_DATA
      }))
  }

}

module.exports = {
  getListDepoCard,
  sendEffectList,
  sendHelpAdvBookCard
}