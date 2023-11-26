import CommentLikeTableTestHelper from '../../../../tests/CommentLikeTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import pool from '../../database/postgres/pool.js'
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js'

describe('CommentLikeRepository postgres', () => {
  const fakeUser = {
    id: 'user-12345678901234567890',
    username: 'user'
  }

  const fakeThread = {
    id: 'thread-12345678901234567890',
    owner: fakeUser.id
  }

  const fakeComment = {
    id: 'comment-12345678901234567890',
    owner: fakeUser.id,
    threadId: fakeThread.id
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser)
    await ThreadsTableTestHelper.addThread(fakeThread)
    await CommentsTableTestHelper.addComment(fakeComment)
  })

  afterEach(async () => {
    await CommentLikeTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addUserToLikedTheComment function', () => {
    it('should persist user and the liked comment in database', async () => {
      const newUserAndLikedComment = {
        userId: fakeUser.id,
        commentId: fakeComment.id
      }

      const fakeIdGenerator = () => '12345678901234567890' // stub!
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentLikeRepository.addUserToLikedTheComment(newUserAndLikedComment)

      // Assert
      const userAndLikedComment = await CommentLikeTableTestHelper
        .findCommentLikeById(`like-${fakeIdGenerator()}`)

      expect(userAndLikedComment).toHaveLength(1)
      expect(userAndLikedComment[0].id).toBe(`like-${fakeIdGenerator()}`)
      expect(userAndLikedComment[0].user_id).toBe(fakeUser.id)
      expect(userAndLikedComment[0].comment_id).toBe(fakeComment.id)
    })
  })

  describe('removeUserFromLikedTheComment function', () => {
    it('should remove user and the liked comment from database', async () => {
      const fakeUserAndLikedComment = {
        id: 'like-12345678901234567890',
        userId: fakeUser.id,
        commentId: fakeComment.id
      }
      await CommentLikeTableTestHelper.addCommentLike(fakeUserAndLikedComment)

      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})

      // Assert before action
      const userAndLikedCommentBeforeAction = await CommentLikeTableTestHelper
        .findCommentLikeById(fakeUserAndLikedComment.id)
      expect(userAndLikedCommentBeforeAction).toHaveLength(1)

      // Action
      await commentLikeRepository.removeUserFromLikedTheComment({
        userId: fakeUserAndLikedComment.userId,
        commentId: fakeUserAndLikedComment.commentId
      })

      // Assert after action
      const userAndLikedCommentAfterAction = await CommentLikeTableTestHelper
        .findCommentLikeById(fakeUserAndLikedComment.id)
      expect(userAndLikedCommentAfterAction).toHaveLength(0)
    })
  })

  describe('verifyUserIsLikedTheComment function', () => {
    it('should return false if user not liked the comment', async () => {
      const NotAvailableUserAndLikedComment = {
        id: 'like-12345678901234567890',
        userId: fakeUser.id,
        commentId: fakeComment.id
      }

      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})

      // Action
      const iseUserTheComment = await commentLikeRepository.verifyUserIsLikedTheComment({
        userId: NotAvailableUserAndLikedComment.userId,
        commentId: NotAvailableUserAndLikedComment.commentId
      })

      // Assert
      const userAndLikedComment = await CommentLikeTableTestHelper
        .findCommentLikeById(NotAvailableUserAndLikedComment.id)
      expect(userAndLikedComment).toHaveLength(0)
      expect(iseUserTheComment).toStrictEqual(false)
    })

    it('should return true if user not liked the comment', async () => {
      const ExistingUserAndLikedComment = {
        id: 'like-12345678901234567890',
        userId: fakeUser.id,
        commentId: fakeComment.id
      }

      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})
      await CommentLikeTableTestHelper.addCommentLike(ExistingUserAndLikedComment)

      // Action
      const iseUserTheComment = await commentLikeRepository.verifyUserIsLikedTheComment({
        userId: ExistingUserAndLikedComment.userId,
        commentId: ExistingUserAndLikedComment.commentId
      })

      // Assert
      const userAndLikedComment = await CommentLikeTableTestHelper
        .findCommentLikeById(ExistingUserAndLikedComment.id)
      expect(userAndLikedComment).toHaveLength(1)
      expect(iseUserTheComment).toStrictEqual(true)
    })
  })

  describe('getCommentLikesCount function', () => {
    it('should return like count correctly', async () => {
      const fakeUser1 = { id: 'user-00000000000000000001', username: 'user-1' }
      const fakeUser2 = { id: 'user-00000000000000000002', username: 'user-2' }
      const fakeUser3 = { id: 'user-00000000000000000003', username: 'user-3' }

      await UsersTableTestHelper.addUser(fakeUser1)
      await UsersTableTestHelper.addUser(fakeUser2)
      await UsersTableTestHelper.addUser(fakeUser3)

      // fakeuser1 like fakeComment
      await CommentLikeTableTestHelper.addCommentLike({
        id: 'like-00000000000000000001',
        userId: fakeUser1.id,
        commentId: fakeComment.id
      })
      // fakeuser2 like fakeComment
      await CommentLikeTableTestHelper.addCommentLike({
        id: 'like-00000000000000000002',
        userId: fakeUser2.id,
        commentId: fakeComment.id
      })
      // fakeuser3 like fakeComment
      await CommentLikeTableTestHelper.addCommentLike({
        id: 'like-00000000000000000003',
        userId: fakeUser3.id,
        commentId: fakeComment.id
      })

      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {})

      // Action
      const commentLikesCount = await commentLikeRepository.getCommentLikesCount(fakeComment.id)

      // Assert
      expect(commentLikesCount).toEqual(3)
    })
  })
})
