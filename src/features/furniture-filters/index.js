const Discord = require('discord.js');
const axios = require('axios');
const general = require('../../constants/general');
const effectTypes = require('../../constants/effect-types');
const GENERAL = require('../../constants/general');

require('dotenv').config();

function sendHelpAdvBookFurnitures(message) {
  message.channel.send('Please input the item name. *Format:* `' + GENERAL.DEPO_FURNITURE_HELP + ' {effect_name}`\nTo check other commands try using `&help`');
}

function sendEffectList(message) {
  let effectList = '';

  effectTypes.furnitureEffectTypes.forEach((effect, index) => {
    effectList += `${index + 1}. ${effect.title} \n`
  })

  const effectListMessage = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle(`List Adventure Book Effects:`)
    .setDescription(effectList)
    .setTimestamp();

  message.channel.send(effectListMessage);
}

function getListDepoFurnitures(message) {
  const searchEffect = message.content.split(general.DEPO_FURNITURE);
  const searchEffectValue = searchEffect[1].toLowerCase();
  const effect = effectTypes.furnitureEffectTypes.filter((eTypes) => eTypes.title.toLowerCase() === searchEffectValue);

  if (effect.length === 0) message.channel.send(`Effect doesn't exist. Please check list effect !`);
  else {
    axios.get('https://www.romcodex.com/api/furniture')
      .then((response) => {
        const furnitures = response.data.filter(
          (e) => {
            if (e[6]) return e[6].toLowerCase().includes(`${effect[0].value.toLowerCase()}`);
            return false
          }
        );

        if (furnitures.length === 0) message.channel.send(`Furnitures with effect : *${searchEffect[1]}* is not found !`);

        let listFurnitures = [];
        let textListFurnitures = '';

        const sortedFurnituresList = furnitures.sort((furnitureA, furnitureB) => furnitureA[3].localeCompare(furnitureB[3]));

        sortedFurnituresList.forEach((furniture, index) => {
          let temp = textListFurnitures;
          temp += `- ${furniture[3]}\n`;

          if (temp.length >= 1990) {
            listFurnitures.push(textListFurnitures);
            textListFurnitures = `- ${furniture[3]}\n`;
          } else {
            textListFurnitures = temp;
          }

          if (index + 1 === furnitures.length) {
            listFurnitures.push(textListFurnitures);
          }
        })

        listFurnitures.forEach((list) => message.channel.send('```' + list + '```'));
      }).catch((err) => {
        console.log(err);
        message.channel.send('Failed to fetch data from server! Please try again ...')
      })
  }

}

module.exports = {
  getListDepoFurnitures,
  sendEffectList,
  sendHelpAdvBookFurnitures
}