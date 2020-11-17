const Discord = require('discord.js');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

const EQUIPMENT_CONSTANT = require('../../constants/equipment-filters');

async function synthesisEquipment(message) {
  const searchMessage = message.content.split(EQUIPMENT_CONSTANT.SYNTHESIS);
  const searchItemName = searchMessage[1].toLowerCase();

  const tierList = [
    { tier: "", value: 0},
    { tier: "I", value: 1},
    { tier: "II", value: 2},
    { tier: "III", value: 3},
    { tier: "IV", value: 4},
    { tier: "V", value: 5},
    { tier: "VI", value: 6},
    { tier: "VII", value: 7},
    { tier: "VIII", value: 8},
    { tier: "IX", value: 9},
    { tier: "X", value: 10}
  ]

  if (searchItemName) {
    // GET EQUIPMENT LIST
    let equipments = [];
    await axios.get('https://www.romcodex.com/api/equipment')
      .then((response) => {
        equipments = response.data.map((item) => ({
          itemId: item[6].replace("item_", ""),
          itemName: item[0]
        }))
      })
      .catch(() => {
        message.channel.send("Maaf botnya keknya kena block sama server :pepega:")
      })

    let maxScore = 0;
    let result = [];
  
    equipments.forEach((equipment) => {
      const currentItemName = equipment.itemName.toLowerCase();
      let score = stringSimilarity.compareTwoStrings(currentItemName, searchItemName);
  
      if (maxScore < score) {
        maxScore = score;
        result = equipment;
      }
    });
  
    if (maxScore === 0) message.channel.send('Equipment is not found');
    else {
      await axios.get(`https://www.romcodex.com/api/item/${result.itemId}`)
        .then((response) => {
          const weaponDetails = response.data;

          if (weaponDetails.SynthesisRecipe.length > 0) {
            const synthesisRecipe = weaponDetails.SynthesisRecipe[0];

            var synthesisMaterials = ""; 
            synthesisRecipe.input.materials.forEach((material) => {
              synthesisMaterials +=  `${material.quantity}x **` + material.item.NameZh__EN + '**\n';
            })

            var synthesisEquipments = ""; 
            synthesisRecipe.input.weapons.forEach((weapon) => {
              const tiertext = tierList.filter((tier) => tier.value === weapon.tier)[0];
              synthesisEquipments += "1x **" + weapon.item.NameZh__EN + ` ${tiertext.tier}**\n`
            })

            const exampleEmbed = new Discord.RichEmbed()
              .setColor('#0099ff')
              .setTitle(synthesisRecipe.output.item.NameZh__EN || "???")
              .setThumbnail(`https://www.romcodex.com/icons/item/item_${synthesisRecipe.output.id}.png`)
              .addField("Materials", synthesisMaterials)
              .addField("Weapon Materials", synthesisEquipments)
              .addField('Cost Price', synthesisRecipe.cost || "???")
              .setTimestamp()

            message.channel.send(exampleEmbed);
          }
        })
        .catch((error) => {
          message.channel.send("Can't fetch data details from server, kalau bukan TULIS NAMANYA YANG BENER !!")
        })
    }
  } else {
    message.channel.send("Mana nama itemnya jir!!")
  }

  
}

module.exports = {
  synthesisEquipment,
}