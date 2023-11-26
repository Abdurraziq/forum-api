exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'CHAR(27)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'CHAR(25)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('threads')
}
