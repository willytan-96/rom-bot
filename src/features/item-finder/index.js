const Discord = require('discord.js');
const axios = require('axios');
const GENERAL = require('../../constants/general');

function findItemFeature(message) {
  const searchMessages = message.content.split(GENERAL.FIND_ITEM);
  const searchItemMessage = searchMessages[1].toLowerCase();

  message.channel.send("Item name : " + searchItemMessage)
}

module.exports = {
  findItemFeature,
}