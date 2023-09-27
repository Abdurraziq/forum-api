const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const fakeNewThreadPayload = {
      title: 'title-xxxx',
      body: 'content-xxxx',
      owner: 'user-xxx'
    }

    const fakeNewThread = new NewThread(fakeNewThreadPayload)

    const fakeAddedThread = new AddedThread({
      id: 'thread-xxxxxx',
      title: fakeNewThreadPayload.title,
      owner: fakeNewThreadPayload.owner
    })

    const expectedAddedThread = new AddedThread({
      id: 'thread-xxxxxx',
      title: fakeNewThreadPayload.title,
      owner: fakeNewThreadPayload.owner
    })

    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(fakeAddedThread))

    // create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const actualAddThread = await addThreadUseCase
      .execute(fakeNewThreadPayload)

    // Assert
    expect(actualAddThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.addThread)
      .toBeCalledWith(fakeNewThread)
  })
})
