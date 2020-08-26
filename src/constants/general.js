const BUFF_EXTRACTION = require('./buff-extraction');

const DEPO_CARD_HELP = '!depo card';
const DEPO_CARD = '!depo card ';
const DEPO_CARD_LIST = '!depo card list';

module.exports = {
  HELP: '&help',
  HELP_MESSAGE: `- ${BUFF_EXTRACTION.EXTRACTION_LIST}
    - ${BUFF_EXTRACTION.EXTRACT} **{item_name}**
    - ${DEPO_CARD} **{effect_name}**
    - ${DEPO_CARD_LIST}
  `,
  DEPO_CARD_HELP,
  DEPO_CARD,
  DEPO_CARD_LIST
};
