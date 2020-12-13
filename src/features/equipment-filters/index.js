const Discord = require('discord.js');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

const COMMANDS = require('../../helpers/commands');
const EQUIPMENT_CONSTANT = require('../../constants/equipment-filters');
const EQUIPMENT_TIERS = require('../../constants/equipment-tiers');
const API = require('../../constants/api');
const ERROR = require('../../constants/error-message');

async function synthesisEquipment(message) {
  const searchItemName = COMMANDS.findMessage(EQUIPMENT_CONSTANT.SYNTHESIS, message);

  if (!searchItemName) message.channel.send(ERROR.EMPTY_ITEM_NAME);
  else {
    let equipmentList = [];
    await axios.get(API.URL.EQUIPMENTS)
      .then((response) => {
        equipmentList = response.data.map((item) => ({
          itemId: item[6].replace("item_", ""),
          itemName: item[0]
        }))
      })
      .catch(() => {
        message.channel.send(ERROR.UNABLE_FETCH_DATA)
        return;
      })

    let maxScore = 0;
    let result = [];

    equipmentList.forEach((equipment) => {
      const currentItemName = equipment.itemName.toLowerCase();
      let score = stringSimilarity.compareTwoStrings(currentItemName, searchItemName);

      if (maxScore < score) {
        maxScore = score;
        result = equipment;
      }
    });

    if (maxScore === 0) message.channel.send(ERROR.UNABLE_FIND_SIMILAR_ITEM);
    else {
      await axios.get(API.URL.GET_ITEM_BY_ID(result.itemId))
        .then(async ({ data: weaponDetails  }) => {
          if (weaponDetails.SynthesisRecipe.length > 0) {
            const synthesisRecipe = weaponDetails.SynthesisRecipe[0];

            var synthesisMaterials = "";
            synthesisRecipe.input.materials.forEach(({
              quantity,
              item
            }) => {
              synthesisMaterials += `${quantity}x **` + item.NameZh__EN + '**\n';
            })

            var synthesisEquipments = "";
            synthesisRecipe.input.weapons.forEach((weapon) => {
              const filteredTier = EQUIPMENT_TIERS.filter((tier) => tier.value === weapon.tier)[0];
              synthesisEquipments += "1x **" + weapon.item.NameZh__EN + ` ${filteredTier.tier}**\n`
            })

            const { id: syntesisItemId } = synthesisRecipe.output;

            var synthesisWeaponDetails = weaponDetails;
            if (synthesisWeaponDetails.id !== syntesisItemId) {
              await axios.get(API.URL.GET_ITEM_BY_ID(syntesisItemId))
                .then(({ data }) => {
                  synthesisWeaponDetails = data;
                }).catch(() => {
                  message.channel.send(ERROR.FAILED_TO_RETRIEVE_SYNTHESIS_INFORMATION);
                })
            }

            let synthesisWeaponStatus = "";
            let synthesisWeaponExtraStatus = "";

            const {
              Stat: synthesisWeaponDetailStats,
              StatExtra: synthesisWeaponDetailExtraStats
            } = synthesisWeaponDetails.AttrData;

            synthesisWeaponDetailStats.forEach((status, index) => {
              synthesisWeaponStatus += `- ${status}${index+1 === synthesisWeaponDetailStats.length ? "" : "\n"}`
            })

            synthesisWeaponDetailExtraStats.forEach((status, index) => {
              synthesisWeaponExtraStatus += `- ${status}${index+1 === synthesisWeaponDetailExtraStats.length ? "" : "\n"}`
            })

            const synthesisWeaponThumbnail = API.URL.GET_ITEM_ICON_BY_ID(syntesisItemId);
            const synthesisWeaponItemName = synthesisWeaponDetails.NameZh__EN || "Unknown";
            const synthesisWeaponItemType = synthesisWeaponDetails.TypeName;
            const synthesisWeaponPrice = `${synthesisRecipe.cost}z` || "Unknown Price";

            const exampleEmbed = new Discord.RichEmbed()
              .setColor('#0099ff')
              .setTitle(synthesisWeaponItemName)
              .setThumbnail(synthesisWeaponThumbnail)
              .addField("Item Type", synthesisWeaponItemType)
              .addField("Status", synthesisWeaponStatus)
              .addField("Effects", synthesisWeaponExtraStatus)
              .addBlankField()
              .addField("Upgrade Materials", synthesisMaterials)
              .addField("Weapon Materials", synthesisEquipments)
              .addField('Cost Price', synthesisWeaponPrice)

            message.channel.send(exampleEmbed);
          }
        })
        .catch(() => {
          message.channel.send(ERROR.UNABLE_FETCH_DATA)
        })
    }
  }
}

module.exports = {
  synthesisEquipment,
}