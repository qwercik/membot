const fs = require('fs');
const language = require('app/language');

class MemesStorage {
	constructor(registerPath = 'config/memes.json', imagesDirectoryPath = 'assets/') {
		this.registerPath = registerPath;
		this.imagesDirectoryPath = imagesDirectoryPath;
	}
	
	pull() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.registerPath, (error, data) => {
				if (error) {
					reject(language["memes_register_load_error"]);
				}
				
				try {
					this.register = JSON.parse(data);
				} catch (error) {
					reject(language["memes_register_syntax_error"]);
				}

				resolve();
			});
		});
	}
	
	flush() {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.registerPath, JSON.stringify(this.register), error => {
				if (error) {
					reject(language["meme_register_write_error"]);
				}
			});

			resolve()
		});
	}

	add(meme) {
		const sameMeme = this.register.find(el => el.name === meme.name);
		if (!sameMeme) {
			this.register.push(meme);
		}
	}

	remove(name) {
		this.register = this.register.filter(el => el.name !== name);	
	}
}

const memesStorage = new MemesStorage();
module.exports = memesStorage;
