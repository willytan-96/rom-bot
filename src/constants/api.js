module.exports = {
  URL: {
    CARDS: 'https://www.romcodex.com/api/card',
    EQUIPMENTS: 'https://www.romcodex.com/api/equipment',
    EXTRACTION_BUFF: 'https://www.romcodex.com/api/extraction-buff',
    FURNITURES: 'https://www.romcodex.com/api/furniture',
    GET_ITEM_BY_ID: (itemId) => `https://www.romcodex.com/api/item/${itemId}`,
    GET_ITEM_ICON_BY_ID: (itemId) => `https://www.romcodex.com/icons/item/item_${itemId}.png`
  }
}