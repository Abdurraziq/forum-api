exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'CHAR(28)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'CHAR(25)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade'
    },
    thread_id: {
      type: 'CHAR(27)',
      notNull: true,
      references: 'threads(id)',
      onDelete: 'cascade'
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('comments')
}
