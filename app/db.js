import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import config from 'config/config'

const fileAdapter = new FileSync(config['databaseFilePath'])
const db = lowdb(fileAdapter)

db.defaults({ pictures: [] })
  .write()

export default db
