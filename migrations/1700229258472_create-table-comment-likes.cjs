exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'CHAR(25)',
      primaryKey: true
    },
    user_id: {
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
    }
  },
  {
    constraints: {
      unique: ['user_id', 'comment_id']
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('comment_likes')
}
