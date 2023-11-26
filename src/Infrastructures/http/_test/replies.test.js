import AuthHelper from '../../../../tests/AuthHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  let accessTokenUser1
  let accessTokenUser2

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
    accessTokenUser2 = await AuthHelper.generateAccessToken(fakeUser2)
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply for comment 1'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()

      const { id, content, owner } = responseJson.data.addedReply
      const repliesInDb = await RepliesTableTestHelper.findReplyById(id)

      expect(id).toEqual(repliesInDb[0].id)
      expect(content).toEqual(repliesInDb[0].content)
      expect(owner).toEqual(repliesInDb[0].owner)
    })

    it('should response 400 if data payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('balasan gagal ditambahkan karena properti yang dibutuhkan tidak lengkap')
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
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('balasan gagal ditambahkan karena tipe data tidak sesuai')
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply for comments 1'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies`,
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 if thread or/and comment not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comments for not exist thread'
      }

      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'POST',
        url: '/threads/not_exist_thread/comments/not_exist_comment/replies',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response2 = await server.inject({
        method: 'POST',
        url: `/threads/not_exist_thread/comments/${fakeComment1.id}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response3 = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThread1.id}/comments/not_exist_comment/replies`,
        payload: requestPayload,
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft delete comment', async () => {
      // Arrange
      const fakeReply1 = {
        id: 'reply-00000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id,
        commentId: fakeComment1.id
      }

      await RepliesTableTestHelper.addReply(fakeReply1)

      const server = await createServer(container)

      // Assert before deletion
      const ReplyBeforeDeletion = await RepliesTableTestHelper.findReplyById(fakeReply1.id)
      expect(ReplyBeforeDeletion[0].is_deleted).toStrictEqual(false)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies/${fakeReply1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      // Assert after deletion
      const responseJson = JSON.parse(response.payload)
      const ReplyAfterDeletion = await RepliesTableTestHelper.findReplyById(fakeReply1.id)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(ReplyAfterDeletion[0].is_deleted).toStrictEqual(true)
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/any_thread}/comments/any_comment}/replies/any_reply'

      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 403 if user not authorized', async () => {
      // Arrange
      const fakeReply1 = {
        id: 'reply-00000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id, // owner is user1
        commentId: fakeComment1.id
      }

      await RepliesTableTestHelper.addReply(fakeReply1)
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/${fakeComment1.id}/replies/${fakeReply1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser2}` // try deleted with user2 authorization
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert after deletion
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Anda tidak memiliki hak atas balasan ini')
    })

    it('should response 404 if thread, comment and/or reply not exist', async () => {
      // Arrange
      const fakeReply1 = {
        id: 'reply-00000000000000000000',
        content: 'Comment 1',
        owner: fakeUser1.id, // owner is user1
        commentId: fakeComment1.id
      }

      await RepliesTableTestHelper.addReply(fakeReply1)

      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'DELETE',
        url: `/threads/not_exist_thread/comments/${fakeComment1.id}/replies/${fakeReply1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response2 = await server.inject({
        method: 'DELETE',
        url: `/threads/not_exist_thread/comments/${fakeComment1.id}/replies/not_exist_reply`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response3 = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/not_exist_comment/replies/${fakeReply1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response4 = await server.inject({
        method: 'DELETE',
        url: `/threads/${fakeThread1.id}/comments/not_exist_comment/replies/not_exist_thread`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response5 = await server.inject({
        method: 'DELETE',
        url: `/threads/not_exist_thread/comments/not_exist_comment/replies/${fakeReply1.id}`,
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })
      const response6 = await server.inject({
        method: 'DELETE',
        url: '/threads/not_exist_thread/comments/not_exist_comment/replies/not_exist_thread',
        headers: {
          authorization: `Bearer ${accessTokenUser1}`
        }
      })

      const responseJson1 = JSON.parse(response1.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)
      const responseJson4 = JSON.parse(response4.payload)
      const responseJson5 = JSON.parse(response5.payload)
      const responseJson6 = JSON.parse(response6.payload)

      // Assert
      expect(response1.statusCode).toEqual(404)
      expect(response2.statusCode).toEqual(404)
      expect(response3.statusCode).toEqual(404)
      expect(response4.statusCode).toEqual(404)
      expect(response5.statusCode).toEqual(404)
      expect(response6.statusCode).toEqual(404)
      expect(responseJson1.status).toEqual('fail')
      expect(responseJson2.status).toEqual('fail')
      expect(responseJson3.status).toEqual('fail')
      expect(responseJson4.status).toEqual('fail')
      expect(responseJson5.status).toEqual('fail')
      expect(responseJson6.status).toEqual('fail')
      expect(responseJson1.message).toEqual('Balasan tidak ditemukan')
      expect(responseJson2.message).toEqual('Balasan tidak ditemukan')
      expect(responseJson3.message).toEqual('Balasan tidak ditemukan')
      expect(responseJson4.message).toEqual('Balasan tidak ditemukan')
      expect(responseJson5.message).toEqual('Balasan tidak ditemukan')
      expect(responseJson6.message).toEqual('Balasan tidak ditemukan')
    })
  })
})
