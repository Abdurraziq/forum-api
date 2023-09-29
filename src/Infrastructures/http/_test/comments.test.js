import AuthHelper from '../../../../tests/AuthHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments endpoint', () => {
  let accessTokenUser1
  let accessTokenUser2

  const fakeUser1 = {
    id: 'user-000000000000000000001',
    username: 'userx'
  }

  const fakeUser2 = {
    id: 'user-000000000000000000002',
    username: 'usery'
  }

  const fakeThread1 = {
    id: 'thread-000000000000000000001',
    title: 'Thread title 1',
    body: 'Thread body content 1',
    owner: fakeUser1.id
  }

  const fakeThread2 = {
    id: 'thread-000000000000000000002',
    title: 'Thread title 2',
    body: 'Thread body content 2',
    owner: fakeUser2.id
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser1)
    await UsersTableTestHelper.addUser(fakeUser2)
    await ThreadsTableTestHelper.addThread(fakeThread1)
    await ThreadsTableTestHelper.addThread(fakeThread2)
    accessTokenUser1 = await AuthHelper.generateAccessToken(fakeUser1)
    accessTokenUser2 = await AuthHelper.generateAccessToken(fakeUser2)
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comments for thread 1'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()

      const { id, content, owner } = responseJson.data.addedComment
      const commentInDb = await CommentsTableTestHelper.findCommentById(id)

      expect(id).toEqual(commentInDb[0].id)
      expect(content).toEqual(commentInDb[0].content)
      expect(owner).toEqual(commentInDb[0].owner)
    })

    it('should response 400 if data payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar gagal ditambahkan karena properti yang dibutuhkan tidak lengkap')
    })

    it('should response 400 if data payload not meet type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123.456
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar gagal ditambahkan karena tipe data tidak sesuai')
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comments for thread 1'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments`,
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 if thread not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comments for not exist thread'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/not_exist_thread/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft delete comment', async () => {
      // Arrange
      const fakeComment1 = {
        id: 'comment-000000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id,
        threadId: fakeThread1.id
      }

      await CommentsTableTestHelper.addComment(fakeComment1)
      const server = await createServer(container)

      // Assert before deletion
      const CommentBeforeDeletion = await CommentsTableTestHelper.findCommentById(fakeComment1.id)
      expect(CommentBeforeDeletion[0].is_deleted).toStrictEqual(false)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert after deletion
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      const CommentAfterDeletion = await CommentsTableTestHelper.findCommentById(fakeComment1.id)
      expect(CommentAfterDeletion[0].is_deleted).toStrictEqual(true)
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/any_thread/comments/any_comment'
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 403 if user not authorized', async () => {
      // Arrange
      const fakeComment1 = {
        id: 'comment-000000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id, // owner user 1
        threadId: fakeThread1.id
      }

      await CommentsTableTestHelper.addComment(fakeComment1)
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser2}` // try deleted with user2 authorization
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert after deletion
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Anda tidak memiliki hak atas komentar ini')
    })

    it('should response 404 if thread or/and comment not exist', async () => {
      // Arrange
      const fakeComment1 = {
        id: 'comment-000000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id,
        threadId: fakeThread1.id
      }

      await CommentsTableTestHelper.addComment(fakeComment1)

      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'DELETE',
        url: `/threads/not_exist_thread/comments/${fakeComment1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response2 = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/not_exist_comment`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response3 = await server.inject({
        method: 'DELETE',
        url: '/threads/not_exist_thread/comments/not_exist_comment',
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
