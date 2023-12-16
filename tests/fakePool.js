/* istanbul ignore file */
import pg from 'pg'

const fakeConfig = {
  host: 'non-exist-host',
  port: 'non-exist-port',
  user: 'non-exist-user',
  password: 'non-exist-password',
  database: 'non-exist-db'
}

export default new pg.Pool(fakeConfig)
