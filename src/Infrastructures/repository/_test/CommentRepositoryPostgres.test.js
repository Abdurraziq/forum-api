const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
  const fakeUser = {
    id: 'user-123456789012345678901',
    username: 'user'
  }

  const fakeThread = {
    id: 'thread-123456789012345678901',
    owner: fakeUser.id
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser)
    await ThreadsTableTestHelper.addThread(fakeThread)
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addCommentToThread function', () => {
    it('should persist comment in database', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'Comment',
        owner: fakeUser.id,
        threadId: fakeThread.id
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentRepositoryPostgres.addCommentToThread(newComment)

      // Assert
      const comments = await CommentsTableTestHelper
        .findCommentById(`comment-${fakeIdGenerator()}`)

      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe(`comment-${fakeIdGenerator()}`)
      expect(comments[0].content).toBe(newComment.content)
      expect(comments[0].owner).toBe(newComment.owner)
      expect(comments[0].thread_id).toBe(newComment.threadId)
      expect(comments[0].is_deleted).toBeFalsy()
      expect(comments[0].date).not.toBeUndefined()
      expect(comments[0].date).not.toBeNull()
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'Comment',
        owner: fakeUser.id,
        threadId: fakeThread.id
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addCommentToThread(newComment)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: `comment-${fakeIdGenerator()}`,
        content: newComment.content,
        owner: newComment.owner
      }))
    })
  })

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment in thread is not found', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres
        .verifyAvailableComment({
          commentId: 'wrong-id',
          threadId: 'wrong-id'
        })).rejects.toThrowError(NotFoundError)
      await expect(threadRepositoryPostgres
        .verifyAvailableComment({
          commentId: fakeComment.id,
          threadId: 'wrong-id'
        })).rejects.toThrowError(NotFoundError)
      await expect(threadRepositoryPostgres
        .verifyAvailableComment({
          commentId: 'wrong-id',
          threadId: fakeThread.id
        })).rejects.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when comment in thread is (soft) deleted', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      await CommentsTableTestHelper.softDeleteCommentById(fakeComment.id)

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert before deletion
      await expect(commentRepositoryPostgres
        .verifyAvailableComment({
          commentId: fakeComment.id,
          threadId: fakeThread.id
        })).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment in thread is found', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres
        .verifyAvailableComment({
          commentId: fakeComment.id,
          threadId: fakeThread.id
        })).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyOwnershipOfComment function', () => {
    it('should throw AuthorizationError when comment and owner is not match', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnershipOfComment({
        commentId: fakeComment.id,
        owenerId: 'not-exist-owner'
      })).rejects.toThrowError(AuthorizationError)
      await expect(commentRepositoryPostgres.verifyOwnershipOfComment({
        commentId: 'not-exist-comment',
        owenerId: fakeUser.id
      })).rejects.toThrowError(AuthorizationError)
      await expect(commentRepositoryPostgres.verifyOwnershipOfComment({
        commentId: 'not-exist-comment',
        owenerId: 'not-exist-owner'
      })).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when comment and owner is match', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnershipOfComment({
        commentId: fakeComment.id,
        owner: fakeComment.owner
      })).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteCommentById function', () => {
    it('should soft delete comment corectly', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Assert berfore action
      const commentsBeforeDeletion = await CommentsTableTestHelper.findCommentById(fakeComment.id)
      expect(commentsBeforeDeletion).toHaveLength(1)
      expect(commentsBeforeDeletion[0].is_deleted).toBeFalsy()

      // Action
      await commentRepositoryPostgres.deleteCommentById(fakeComment.id)

      // Assert after action
      const commentsAfterDeletion = await CommentsTableTestHelper.findCommentById(fakeComment.id)
      expect(commentsAfterDeletion).toHaveLength(1)
      expect(commentsAfterDeletion[0].is_deleted).toBeTruthy()
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should return empty array when no comments related to thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('wrong-id')
      expect(comments).toStrictEqual([])
    })

    it('should return comments correctly', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        content: 'Comment',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(fakeThread.id)

      // Assert
      expect(comments).toHaveLength(1)
      expect(comments[0].id).toEqual(fakeComment.id)
      expect(comments[0].username).toEqual(fakeUser.username)
      expect(comments[0].content).toEqual(fakeComment.content)
      expect(comments[0].date).not.toBeNull()
      expect(comments[0].date).not.toBeUndefined()
    })

    it('should return comments content correctly, before and after soft deletion', async () => {
      // Arrange
      const fakeComment = {
        id: 'comment-123456789012345678901',
        content: 'Comment',
        owner: fakeUser.id,
        threadId: fakeThread.id
      }
      await CommentsTableTestHelper.addComment(fakeComment)

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and assert before soft deletion
      const commentsBeforeDeletion = await commentRepositoryPostgres.getCommentsByThreadId(fakeThread.id)
      expect(commentsBeforeDeletion).toHaveLength(1)
      expect(commentsBeforeDeletion[0].content).toEqual(fakeComment.content)

      // Soft deletion
      await CommentsTableTestHelper.softDeleteCommentById(fakeComment.id)

      // Action and assert after soft deletion
      const commentsAfterDeletion = await commentRepositoryPostgres.getCommentsByThreadId(fakeThread.id)
      expect(commentsAfterDeletion).toHaveLength(1)
      expect(commentsAfterDeletion[0].content).toEqual('**komentar telah dihapus**')
    })
  })
})
