const Discord = require('discord.js');
const axios = require('axios');
const effectTypes = require('../../constants/effect-types');
const GENERAL = require('../../constants/general');
const API = require('../../constants/api');
const ERROR = require('../../constants/error-message');

require('dotenv').config();

function sendHelpAdvBookFurnitures(message) {
  message.channel.send('Please input the item name. *Format:* `' + GENERAL.DEPO_FURNITURE_HELP + ' {effect_name}`\nTo check other commands try using `&help`');
}

function sendEffectList() {
  let effectList = '';

  effectTypes.furnitureEffectTypes.forEach((effect, index) => {
    effectList += `${index + 1}. ${effect.title} \n`
  })

  const effectListMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`List Adventure Book Effects:`)
    .setDescription(effectList)
    .setTimestamp();

  return {
    embeds: [effectListMessage]
  };
}

function getListDepoFurnitures(effectName) {
  const searchEffectValue = effectName.toLowerCase();
  const effect = effectTypes.furnitureEffectTypes.filter((eTypes) => eTypes.title.toLowerCase() === searchEffectValue);

  if (effect.length === 0) return {
    content: `Effect doesn't exist. Please check list effect !`
  };
  else {
    return axios.get(API.URL.FURNITURES)
      .then((response) => {
        const furnitures = response.data.filter(
          (e) => {
            if (e[6]) return e[6].toLowerCase().includes(`${effect[0].value.toLowerCase()}`);
            return false
          }
        );

        if (furnitures.length === 0) return {
          content: `Furnitures with effect : *${searchEffect[1]}* is not found !`
        };

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

        let listEmbeeds = [];
        listFurnitures.forEach((value, index) => {
          const newEmbeeds = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Search result page - ${index} ::`)
            .setDescription(value)
          listEmbeeds.push(newEmbeeds)
        })

        console.log(listEmbeeds)


        return {
          embeds: listEmbeeds
        }
      }).catch((err) => {
        console.log("Failed ", err)
        return {
          content: ERROR.UNABLE_FETCH_DATA
        }
      })
  }

}

module.exports = {
  getListDepoFurnitures,
  sendEffectList,
  sendHelpAdvBookFurnitures
}