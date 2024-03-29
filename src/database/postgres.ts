import { Pool } from 'pg'
import config from '../config.js'

export default new Pool(config.database)
