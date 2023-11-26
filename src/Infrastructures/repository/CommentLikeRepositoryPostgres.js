import CommentLikeRepository from '../../Domains/comment_likes/CommentLikeRepository.js'

export default class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  #pool
  #idGenerator

  constructor (pool, idGenerator) {
    super()
    this.#pool = pool
    this.#idGenerator = idGenerator
  }
}
