import fs from 'fs'
import config from 'config/config.json'
import language from 'app/language'

class MemesStorage {
  constructor (registerPath, imagesDirectoryPath) {
    this.registerPath = registerPath
    this.imagesDirectoryPath = imagesDirectoryPath
  }

  pull () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.registerPath, (error, data) => {
        if (error) {
          reject(language['memes_register_load_error'])
        }

        try {
          this.register = JSON.parse(data)
        } catch (error) {
          reject(language['memes_register_syntax_error'])
        }

        resolve()
      })
    })
  }

  flush () {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.registerPath, JSON.stringify(this.register), error => {
        if (error) {
          reject(language['meme_register_write_error'])
        }
      })

      resolve()
    })
  }

  async set (meme) {
    const sameMemeIndex = this.register.findIndex(el => el.name === meme.name)
    if (sameMemeIndex === -1) {
      this.register.push(meme)
    } else {
      this.register[sameMemeIndex] = meme
    }

    await this.flush()
  }

  async remove (name) {
    this.register = this.register.filter(el => el.name !== name)

    await this.flush()
  }
}

const memesStorage = new MemesStorage(config.memesRegisterPath, config.memesFilesPath)
memesStorage.MemesStorage = MemesStorage

export default memesStorage
