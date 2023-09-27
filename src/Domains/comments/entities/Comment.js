class Comment {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { id, username, date, content } = payload

    this.id = id
    this.username = username
    this.date = date
    this.content = content
  }

  #verifyPayload ({ id, username, date, content }) {
    if (id === undefined ||
            username === undefined ||
            date === undefined ||
            content === undefined
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
            typeof username !== 'string' ||
            typeof date !== 'string' ||
            typeof content !== 'string'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Comment
