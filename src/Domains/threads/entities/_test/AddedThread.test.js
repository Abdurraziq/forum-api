const AddedThread = require('../AddedThread')

describe('an AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'thread-xxxx',
      title: 'title-xxxx'
    }
    const payload2 = {
      id: 'thread-xxxx',
      owner: 'user-xxxx'
    }
    const payload3 = {
      title: 'title-xxxx',
      owner: 'user-xxxx'
    }

    // Action and Assert
    expect(() => new AddedThread(payload1))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedThread(payload2))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedThread(payload3))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 12345,
      title: null,
      owner: false
    }
    const payload2 = {
      id: '12345',
      title: {},
      owner: []
    }
    const payload3 = {
      id: 12345,
      title: null,
      owner: true
    }

    // Action and Assert
    expect(() => new AddedThread(payload1))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedThread(payload2))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedThread(payload3))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-xxxxxx',
      title: 'New Thread',
      owner: 'user-xxxxxx'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
