const BUFF_EXTRACTION = require('./buff-extraction');

const DEPO_CARD_HELP = '!depo card';
const DEPO_CARD = '!depo card ';
const DEPO_CARD_LIST = '!depo card list';

const DEPO_FURNITURE_HELP = '!depo furniture';
const DEPO_FURNITURE = '!depo furniture ';
const DEPO_FURNITURE_LIST = '!depo furniture list';

module.exports = {
  HELP: '&help',
  HELP_MESSAGE: `- ${BUFF_EXTRACTION.EXTRACTION_LIST}
    - ${BUFF_EXTRACTION.EXTRACT} **{item_name}**
    - ${DEPO_CARD} **{effect_name}**
    - ${DEPO_CARD_LIST}
    - ${DEPO_FURNITURE} **{effect_name}**
    - ${DEPO_FURNITURE_LIST}
  `,
  DEPO_CARD_HELP,
  DEPO_CARD,
  DEPO_CARD_LIST,
  DEPO_FURNITURE_HELP,
  DEPO_FURNITURE,
  DEPO_FURNITURE_LIST
};
