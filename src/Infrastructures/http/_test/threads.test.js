const AuthHelper = require('../../../../tests/AuthHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  let accessToken
  const fakeUser = {
    id: 'user-123456789012345678901',
    username: 'userx'
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser)
    accessToken = await AuthHelper.generateAccessToken(fakeUser)
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Title of thread',
        body: 'Content of thread'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()

      const { id, title, owner } = responseJson.data.addedThread
      const threadInDb = await ThreadsTableTestHelper.findThreadsById(id)

      expect(id).toEqual(threadInDb[0].id)
      expect(title).toEqual(threadInDb[0].title)
      expect(owner).toEqual(threadInDb[0].owner)
    })

    it('should response 400 if data payload not contain needed property', async () => {
      // Arrange
      const requestPayload1 = {
        body: 'Content of thread'
      }
      const requestPayload2 = {
        title: 'Title of thread'
      }
      const requestPayload3 = {}

      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload1,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      const response2 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload2,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      const response3 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload3,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson1 = JSON.parse(response1.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)

      // Assert
      expect(response1.statusCode).toEqual(400)
      expect(response2.statusCode).toEqual(400)
      expect(response3.statusCode).toEqual(400)
      expect(responseJson1.status).toEqual('fail')
      expect(responseJson2.status).toEqual('fail')
      expect(responseJson3.status).toEqual('fail')
      expect(responseJson1.message).toEqual('thread gagal ditambahkan karena properti yang dibutuhkan tidak lengkap')
      expect(responseJson2.message).toEqual('thread gagal ditambahkan karena properti yang dibutuhkan tidak lengkap')
      expect(responseJson3.message).toEqual('thread gagal ditambahkan karena properti yang dibutuhkan tidak lengkap')
    })

    it('should response 400 if data payload not meet type specification', async () => {
      // Arrange
      const requestPayload1 = {
        title: 123,
        body: 'Content of thread'
      }
      const requestPayload2 = {
        title: 'Title of thread',
        body: null
      }
      const requestPayload3 = {
        title: false,
        body: {}
      }

      const server = await createServer(container)

      // Action
      const response1 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload1,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      const response2 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload2,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      const response3 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload3,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson1 = JSON.parse(response1.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)

      // Assert
      expect(response1.statusCode).toEqual(400)
      expect(response2.statusCode).toEqual(400)
      expect(response3.statusCode).toEqual(400)
      expect(responseJson1.status).toEqual('fail')
      expect(responseJson2.status).toEqual('fail')
      expect(responseJson3.status).toEqual('fail')
      expect(responseJson1.message).toEqual('thread gagal ditambahkan karena tipe data tidak sesuai')
      expect(responseJson2.message).toEqual('thread gagal ditambahkan karena tipe data tidak sesuai')
      expect(responseJson3.message).toEqual('thread gagal ditambahkan karena tipe data tidak sesuai')
    })

    it('should response 401 if request headers not contain authorization token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Title of thread',
        body: 'Content of thread'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 with valid data', async () => {
      // Arrange
      const fakeUser2 = {
        id: 'user-000000000000000000000',
        username: 'userxy'
      }

      const fakeUser3 = {
        id: 'user-000000000000000000001',
        username: 'userxyz'
      }

      const fakeThread = {
        id: 'thread-000000000000000000001',
        title: 'Thread title',
        body: 'Thread body content',
        owner: fakeUser.id
      }

      const fakeComment1 = {
        id: 'comment-000000000000000000000',
        content: 'Comment 1',
        owner: fakeUser2.id,
        threadId: fakeThread.id
      }
      const fakeComment2 = {
        id: 'comment-000000000000000000001',
        content: 'Comment 2',
        owner: fakeUser3.id,
        threadId: fakeThread.id
      }

      const fakeReply = {
        id: 'reply-123456789012345678901',
        content: 'Reply',
        owner: fakeUser3.id,
        commentId: fakeComment1.id
      }

      await UsersTableTestHelper.addUser(fakeUser2)
      await UsersTableTestHelper.addUser(fakeUser3)
      await ThreadsTableTestHelper.addThread(fakeThread)
      await CommentsTableTestHelper.addComment(fakeComment1)
      await CommentsTableTestHelper.addComment(fakeComment2)
      await RepliesTableTestHelper.addReply(fakeReply)

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${fakeThread.id}`
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()

      const { id, title, body, date, username, comments } = responseJson.data.thread

      expect(id).toEqual(fakeThread.id)
      expect(title).toEqual(fakeThread.title)
      expect(body).toEqual(fakeThread.body)
      expect(date).toBeDefined()
      expect(username).toEqual(fakeUser.username)
      expect(comments).toHaveLength(2)
      expect(comments[0].id).toEqual(fakeComment1.id)
      expect(comments[0].username).toEqual(fakeUser2.username)
      expect(comments[0].content).toEqual(fakeComment1.content)
      expect(comments[0].date).toBeDefined()
      expect(comments[0].replies).toHaveLength(1)
      expect(comments[0].replies[0].id).toEqual(fakeReply.id)
      expect(comments[0].replies[0].username).toEqual(fakeUser3.username)
      expect(comments[0].replies[0].content).toEqual(fakeReply.content)
      expect(comments[0].replies[0].date).toBeDefined()
      expect(comments[1].id).toEqual(fakeComment2.id)
      expect(comments[1].username).toEqual(fakeUser3.username)
      expect(comments[1].content).toEqual(fakeComment2.content)
      expect(comments[1].date).toBeDefined()
    })

    it('should response 404 when thread not exist', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/not-exist-thread'
      })

      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
  })
})
