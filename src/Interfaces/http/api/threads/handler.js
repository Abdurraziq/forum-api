import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js'
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js'
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js'
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js'
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js'
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase.js'
import LikeCommentUseCase from '../../../../Applications/use_case/LikeCommentUseCase.js'

export default class ThreadsHandler {
  #container
  constructor (container) {
    this.#container = container

    this.postThread = this.postThread.bind(this)
    this.getThread = this.getThread.bind(this)
    this.postComment = this.postComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.postReply = this.postReply.bind(this)
    this.deleteReply = this.deleteReply.bind(this)
    this.putLike = this.putLike.bind(this)
  }

  async postThread ({ payload, auth }, h) {
    const newThreadPayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.userId
    }
    const addThreadUseCase = this.#container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute(newThreadPayload)
    const response = h.response({
      status: 'success',
      data: { addedThread }
    })
    response.code(201)
    return response
  }

  async getThread ({ params }) {
    const getThreadUseCase = this.#container.getInstance(GetThreadUseCase.name)
    const thread = await getThreadUseCase.execute(params.threadId)
    return {
      status: 'success',
      data: { thread }
    }
  }

  async postComment ({ payload, params, auth }, h) {
    const newCommentPayload = {
      content: payload.content,
      owner: auth.credentials.userId,
      threadId: params.threadId
    }
    const addCommentUseCase = this.#container.getInstance(AddCommentUseCase.name)
    const addedComment = await addCommentUseCase.execute(newCommentPayload)
    const response = h.response({
      status: 'success',
      data: { addedComment }
    })
    response.code(201)
    return response
  }

  async deleteComment ({ params, auth }) {
    const deleteCommentPayload = {
      owner: auth.credentials.userId,
      threadId: params.threadId,
      commentId: params.commentId
    }
    const deleteCommentUseCase = this.#container.getInstance(DeleteCommentUseCase.name)
    await deleteCommentUseCase.execute(deleteCommentPayload)
    return { status: 'success' }
  }

  async postReply ({ payload, params, auth }, h) {
    const newReplyPayload = {
      content: payload.content,
      owner: auth.credentials.userId,
      commentId: params.commentId,
      threadId: params.threadId
    }
    const addReplyUseCase = this.#container.getInstance(AddReplyUseCase.name)
    const addedReply = await addReplyUseCase.execute(newReplyPayload)
    const response = h.response({
      status: 'success',
      data: { addedReply }
    })
    response.code(201)
    return response
  }

  async deleteReply ({ params, auth }) {
    const { commentId, threadId, replyId } = params
    const deleteReplyPayload = {
      owner: auth.credentials.userId,
      commentId,
      threadId,
      replyId
    }
    const deleteReplyUseCase = this.#container.getInstance(DeleteReplyUseCase.name)
    await deleteReplyUseCase.execute(deleteReplyPayload)
    return { status: 'success' }
  }

  async putLike ({ params, auth }) {
    const { threadId, commentId } = params
    const { userId } = auth.credentials
    const likeCommentUseCase = this.#container.getInstance(LikeCommentUseCase.name)
    await likeCommentUseCase.execute({ userId, threadId, commentId })
    return { status: 'success' }
  }
}
