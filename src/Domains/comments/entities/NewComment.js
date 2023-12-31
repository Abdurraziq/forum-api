export default class NewComment {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { content, owner, threadId } = payload

    this.content = content
    this.owner = owner
    this.threadId = threadId
  }

  #verifyPayload ({ content, owner, threadId }) {
    if (content === undefined ||
            owner === undefined ||
            threadId === undefined
    ) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' ||
            typeof owner !== 'string' ||
            typeof threadId !== 'string'
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
