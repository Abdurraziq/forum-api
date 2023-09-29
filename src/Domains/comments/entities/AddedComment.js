export default class AddedComment {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { id, content, owner } = payload

    this.id = id
    this.content = content
    this.owner = owner
  }

  #verifyPayload ({ id, content, owner }) {
    if (id === undefined || content === undefined || owner === undefined) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
