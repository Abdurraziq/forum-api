const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  const fakeUser = {
    id: 'user-123456789012345678901',
    username: 'user'
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(fakeUser)
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist thread in database', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
        owner: 'user-123456789012345678901'
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(`thread-${fakeIdGenerator()}`)
      expect(threads).toHaveLength(1)
      expect(threads[0].id).toBe(`thread-${fakeIdGenerator()}`)
      expect(threads[0].title).toBe(newThread.title)
      expect(threads[0].body).toBe(newThread.body)
      expect(threads[0].owner).toBe(newThread.owner)
      expect(threads[0].date).not.toBeNull()
      expect(threads[0].date).not.toBeUndefined()
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
        owner: fakeUser.id
      })

      const fakeIdGenerator = () => '123456789012345678901' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: `thread-${fakeIdGenerator()}`,
        title: newThread.title,
        owner: newThread.owner
      }))
    })
  })

  describe('verifyAvailableThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThreadById('wrong-id'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      const fakeThread = {
        id: 'thread-123456789012345678901',
        owner: fakeUser.id
      }
      await ThreadsTableTestHelper.addThread(fakeThread)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThreadById(fakeThread.id))
        .resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('wrong-id'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should return thread correctly', async () => {
      // Arrange
      const fakeThread = {
        id: 'thread-123456789012345678901',
        title: 'Thread title',
        body: 'Thread body',
        owner: fakeUser.id
      }
      await ThreadsTableTestHelper.addThread(fakeThread)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(fakeThread.id)

      // Assert
      expect(thread.id).toEqual(fakeThread.id)
      expect(thread.title).toEqual(fakeThread.title)
      expect(thread.body).toEqual(fakeThread.body)
      expect(thread.username).toEqual(fakeUser.username)
      expect(thread.date).not.toBeNull()
      expect(thread.date).not.toBeUndefined()
    })
  })
})
