exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'CHAR(26)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'CHAR(25)',
      references: 'users(id)',
      onDelete: 'cascade',
      notNull: true
    },
    comment_id: {
      type: 'CHAR(28)',
      references: 'comments(id)',
      onDelete: 'cascade',
      notNull: true
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
  pgm.dropTable('replies')
}
