import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import config from '#app/config.js'

const fileAdapter = new JSONFileSync(config('databaseFilePath'))
const db = new LowSync(fileAdapter, { pictures: [] })

db.read()

export default db
