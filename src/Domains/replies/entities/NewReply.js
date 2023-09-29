export default class NewReply {
  constructor (payload) {
    this.#verifyPayload(payload)

    const { content, owner, commentId, threadId } = payload
    this.content = content
    this.owner = owner
    this.commentId = commentId
    this.threadId = threadId
  }

  #verifyPayload ({ content, owner, commentId, threadId }) {
    if (content === undefined ||
            owner === undefined ||
            commentId === undefined ||
            threadId === undefined
    ) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' ||
            typeof owner !== 'string' ||
            typeof commentId !== 'string' ||
            typeof threadId !== 'string'
    ) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
