const config = require('config/config.json');

const defaultLanguage = require('app/language/default');
const selectedLanguage = require(`app/language/${config.language}`);

module.exports = Object.assign(defaultLanguage, selectedLanguage);
