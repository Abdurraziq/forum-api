import AuthHelper from '../../../../tests/AuthHelper.js'
import CommentLikeTableTestHelper from '../../../../tests/CommentLikeTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  let accessTokenUser1

  const fakeUser1 = {
    id: 'user-00000000000000000001',
    username: 'userx'
  }

  const fakeUser2 = {
    id: 'user-00000000000000000002',
    username: 'usery'
  }

  const fakeThread1 = {
    id: 'thread-00000000000000000001',
    title: 'Thread title 1',
    body: 'Thread body content 1',
    owner: fakeUser1.id
  }

  const fakeThread2 = {
    id: 'thread-00000000000000000002',
    title: 'Thread title 2',
    body: 'Thread body content 2',
    owner: fakeUser2.id
  }

  const fakeComment1 = {
    id: 'comment-00000000000000000000',
    content: 'Comment 1',
    owner: fakeUser1.id,
    threadId: fakeThread1.id
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser1)
    await UsersTableTestHelper.addUser(fakeUser2)
    await ThreadsTableTestHelper.addThread(fakeThread1)
    await ThreadsTableTestHelper.addThread(fakeThread2)
    await CommentsTableTestHelper.addComment(fakeComment1)
    accessTokenUser1 = await AuthHelper.generateAccessToken(fakeUser1)
  })

  afterEach(async () => {
    await CommentLikeTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 201 and toggle like (like/unlike)', async () => {
      // Arrange
      const server = await createServer(container)

      // Action to like
      const LikeCommentresponse = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/likes`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const likeCommentResponseJson = JSON.parse(LikeCommentresponse.payload)

      // Assert after like
      expect(LikeCommentresponse.statusCode).toEqual(200)
      expect(likeCommentResponseJson.status).toEqual('success')

      const likeCommentInDbAfterLike = await CommentLikeTableTestHelper
        .findCommentByUserAndCommentId({
          commentId: fakeComment1.id,
          userId: fakeUser1.id
        })

      expect(likeCommentInDbAfterLike).toHaveLength(1)
      expect(fakeUser1.id).toEqual(likeCommentInDbAfterLike[0].user_id)
      expect(fakeComment1.id).toEqual(likeCommentInDbAfterLike[0].comment_id)

      // Action to unlike
      const unlikeCommentresponse = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/likes`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const unlikeCommentResponseJson = JSON.parse(unlikeCommentresponse.payload)

      // Assert after unlike
      expect(unlikeCommentresponse.statusCode).toEqual(200)
      expect(unlikeCommentResponseJson.status).toEqual('success')

      const likeCommentInDbAfterUnlike = await CommentLikeTableTestHelper
        .findCommentByUserAndCommentId({
          commentId: fakeComment1.id,
          userId: fakeUser1.id
        })

      expect(likeCommentInDbAfterUnlike).toHaveLength(0)
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/likes`
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 if thread or/and comment not exist', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'PUT',
        url: '/threads/not_exist_thread/comments/not_exist_comment/likes',
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response2 = await server.inject({
        method: 'PUT',
        url: `/threads/not_exist_thread/comments/${fakeComment1.id}/likes`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response3 = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThread1.id}/comments/not_exist_comment/likes`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson1 = JSON.parse(response1.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)

      // Assert
      expect(response1.statusCode).toEqual(404)
      expect(response2.statusCode).toEqual(404)
      expect(response3.statusCode).toEqual(404)
      expect(responseJson1.status).toEqual('fail')
      expect(responseJson2.status).toEqual('fail')
      expect(responseJson3.status).toEqual('fail')
      expect(responseJson1.message).toEqual('Komentar dalam thread tidak ditemukan')
      expect(responseJson2.message).toEqual('Komentar dalam thread tidak ditemukan')
      expect(responseJson3.message).toEqual('Komentar dalam thread tidak ditemukan')
    })
  })
})
