const Discord = require('discord.js');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

const COMMANDS = require('../../helpers/commands');
const EQUIPMENT_CONSTANT = require('../../constants/equipment-filters');
const EQUIPMENT_TIERS = require('../../constants/equipment-tiers');
const API = require('../../constants/api');
const ERROR = require('../../constants/error-message');

async function synthesisEquipment(itemName) {
  const searchItemName = itemName.toLowerCase()

  if (!searchItemName) {
    return { content: ERROR.EMPTY_ITEM_NAME }
  }
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
        return {content: ERROR.UNABLE_FETCH_DATA}
      })

    let maxScore = 0;
    let result = [];

    console.log("Are you here ?")

    equipmentList.forEach((equipment) => {
      const currentItemName = equipment.itemName.toLowerCase();
      let score = stringSimilarity.compareTwoStrings(currentItemName, searchItemName);

      if (maxScore < score) {
        maxScore = score;
        result = equipment;
      }
    });

    if (maxScore === 0) return { content: ERROR.UNABLE_FIND_SIMILAR_ITEM }
    else {
      console.log(result.itemId)
      return await axios.get(API.URL.GET_ITEM_BY_ID(result.itemId))
        .then(async ({ data: weaponDetails }) => {
          console.log("Success ??")
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
                  return { content: ERROR.FAILED_TO_RETRIEVE_SYNTHESIS_INFORMATION };
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

            const exampleEmbed = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle(synthesisWeaponItemName)
              .setThumbnail(synthesisWeaponThumbnail)

            exampleEmbed.fields = [
              { name: "Item type", value: synthesisWeaponItemType},
              { name: "Status", value: synthesisWeaponStatus},
              { name: "Effects", value: synthesisWeaponExtraStatus},
              { name: "Upgrade materials", value: synthesisMaterials},
              { name: "Weapon materials", value: synthesisEquipments},
              { name: "Cost Price", value: synthesisWeaponPrice}
            ]
            return { embeds: [exampleEmbed]}
          }
        })
        .catch(() => {
          return { content: ERROR.UNABLE_FETCH_DATA}
        })
    }
  }
}

module.exports = {
  synthesisEquipment,
}