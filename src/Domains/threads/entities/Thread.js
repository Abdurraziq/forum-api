class Thread {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { id, title, body, date, username } = payload

    this.id = id
    this.title = title
    this.body = body
    this.date = date
    this.username = username
  }

  #verifyPayload ({ id, title, body, date, username }) {
    if (id === undefined ||
            title === undefined ||
            body === undefined ||
            date === undefined ||
            username === undefined
    ) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Thread
