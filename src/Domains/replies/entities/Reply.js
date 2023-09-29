export default class Reply {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { id, content, date, username } = payload

    this.id = id
    this.content = content
    this.date = date
    this.username = username
  }

  #verifyPayload ({ id, content, date, username }) {
    if (id === undefined ||
            content === undefined ||
            date === undefined ||
            username === undefined
    ) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
