const config = require('config/config.json');

const defaultLanguage = require('app/language/en');

try {
	const selectedLanguage = require(`app/language/${config.language}`);

	module.exports = Object.assign(defaultLanguage, selectedLanguage);
} catch (error) {
	throw new Error(defaultLanguage["localization_file_not_exist_error"]);
}

