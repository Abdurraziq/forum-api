import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'
import AddedReply from '../../../Domains/replies/entities/AddedReply.js'
import NewReply from '../../../Domains/replies/entities/NewReply.js'
import pool from '../../database/postgres/pool.js'
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js'

describe('CommentRepositoryPostgres', () => {
  const fakeUser = {
    id: 'user-123456789012345678901',
    username: 'user'
  }

  const fakeThread = {
    id: 'thread-123456789012345678901',
    owner: fakeUser.id
  }

  const fakeComment = {
    id: 'comment-123456789012345678901',
    owner: fakeUser.id,
    threadId: fakeThread.id
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser)
    await ThreadsTableTestHelper.addThread(fakeThread)
    await CommentsTableTestHelper.addComment(fakeComment)
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addReplyToComment function', () => {
    it('should persist reply in database', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'Reply',
        owner: fakeUser.id,
        commentId: fakeComment.id,
        threadId: fakeThread.id
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await replyRepositoryPostgres.addReplyToComment(newReply)

      // Assert
      const comments = await RepliesTableTestHelper
        .findReplyById(`reply-${fakeIdGenerator()}`)

      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe(`reply-${fakeIdGenerator()}`)
      expect(comments[0].content).toBe(newReply.content)
      expect(comments[0].owner).toBe(newReply.owner)
      expect(comments[0].comment_id).toBe(newReply.commentId)
      expect(comments[0].is_deleted).toBeFalsy()
      expect(comments[0].date).not.toBeUndefined()
      expect(comments[0].date).not.toBeNull()
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'Reply',
        owner: fakeUser.id,
        commentId: fakeComment.id,
        threadId: fakeThread.id
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addReply = await replyRepositoryPostgres.addReplyToComment(newReply)

      // Assert
      expect(addReply).toStrictEqual(new AddedReply({
        id: `reply-${fakeIdGenerator()}`,
        content: newReply.content,
        owner: newReply.owner
      }))
    })
  })

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }
      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres
        .verifyAvailableReply({
          replyId: 'wrong-id',
          commentId: fakeComment.id,
          threadId: fakeThread.id
        })).rejects.toThrowError(NotFoundError)
      await expect(replyRepositoryPostgres
        .verifyAvailableReply({
          replyId: fakeReply.id,
          commentId: 'wrong-id',
          threadId: fakeThread.id
        })).rejects.toThrowError(NotFoundError)
      await expect(replyRepositoryPostgres
        .verifyAvailableReply({
          replyId: fakeReply.id,
          commentId: fakeComment.id,
          threadId: 'wrong-id'
        })).rejects.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when reply is (soft) deleted', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }
      await RepliesTableTestHelper.addReply(fakeReply)
      await RepliesTableTestHelper.softDeleteReplyById(fakeReply.id)

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert before deletion
      await expect(replyRepositoryPostgres
        .verifyAvailableReply({
          replyId: fakeReply.id,
          commentId: fakeComment.id,
          threadId: fakeThread.id
        })).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }
      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres
        .verifyAvailableReply({
          replyId: fakeReply.id,
          commentId: fakeComment.id,
          threadId: fakeThread.id
        }))
        .resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyOwnershipOfReply function', () => {
    it('should throw AuthorizationError when reply and owner is not match', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }

      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwnershipOfReply({
        commentId: fakeComment.id,
        owner: 'not-owner'
      })).rejects.toThrowError(AuthorizationError)
      await expect(replyRepositoryPostgres.verifyOwnershipOfReply({
        commentId: 'non-exist-comment',
        owner: fakeUser.id
      })).rejects.toThrowError(AuthorizationError)
      await expect(replyRepositoryPostgres.verifyOwnershipOfReply({
        commentId: 'non-exist-comment',
        owner: 'not-owner'
      })).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when reply and owner is match', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }

      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwnershipOfReply({
        replyId: fakeReply.id,
        owner: fakeComment.owner
      })).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReplyById function', () => {
    it('should soft delete reply correctly', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        commentId: fakeComment.id
      }

      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Assert before action
      const repliesBeforeDeletion = await RepliesTableTestHelper.findReplyById(fakeReply.id)
      expect(repliesBeforeDeletion).toHaveLength(1)
      expect(repliesBeforeDeletion[0].is_deleted).toBeFalsy()

      // Action
      await replyRepositoryPostgres.deleteReplyById(fakeReply.id)

      // Assert after action
      const repliesAfterDeletion = await RepliesTableTestHelper.findReplyById(fakeReply.id)
      expect(repliesAfterDeletion).toHaveLength(1)
      expect(repliesAfterDeletion[0].is_deleted).toBeTruthy()
    })
  })

  describe('getRepliesByCommentId function', () => {
    it('should return empty array when no replies related to comment', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('wrong-id')
      expect(replies).toStrictEqual([])
    })

    it('should return replies correctly', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        content: 'Reply',
        commentId: fakeComment.id
      }

      await RepliesTableTestHelper.addReply(fakeReply)
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(fakeComment.id)

      // Assert
      expect(replies).toHaveLength(1)
      expect(replies[0].id).toEqual(fakeReply.id)
      expect(replies[0].username).toEqual(fakeUser.username)
      expect(replies[0].content).toEqual(fakeReply.content)
      expect(replies[0].date).not.toBeNull()
      expect(replies[0].date).not.toBeUndefined()
    })

    it('should return replies content correctly, before and after soft deletion', async () => {
      // Arrange
      const fakeReply = {
        id: 'reply-123456789012345678901',
        owner: fakeUser.id,
        content: 'Reply',
        commentId: fakeComment.id
      }
      await RepliesTableTestHelper.addReply(fakeReply)

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and assert before soft deletion
      const repliesBeforeDeletion = await replyRepositoryPostgres.getRepliesByCommentId(fakeComment.id)
      expect(repliesBeforeDeletion).toHaveLength(1)
      expect(repliesBeforeDeletion[0].content).toEqual(fakeReply.content)

      // Soft deletion
      RepliesTableTestHelper.softDeleteReplyById(fakeReply.id)

      // Action and assert after soft deletion
      const repliesAfterDeletion = await replyRepositoryPostgres.getRepliesByCommentId(fakeComment.id)
      expect(repliesAfterDeletion).toHaveLength(1)
      expect(repliesAfterDeletion[0].content).toEqual('**balasan telah dihapus**')
    })
  })
})
