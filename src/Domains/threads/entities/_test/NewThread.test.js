import NewThread from '../NewThread.js'

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'title-xxxx',
      owner: 'user-xxx'
    }
    const payload2 = {
      body: 'content-xxxx',
      owner: 'user-xxx'
    }
    const payload3 = {
      title: 'title-xxxx',
      body: 'content-xxxx'
    }

    // Action and Assert
    expect(() => new NewThread(payload1))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewThread(payload2))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new NewThread(payload3))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      title: 12345,
      body: null,
      owner: []
    }
    const payload2 = {
      title: false,
      body: {},
      owner: null
    }
    const payload3 = {
      title: [],
      body: null,
      owner: 0x00
    }

    // Action and Assert
    expect(() => new NewThread(payload1))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewThread(payload2))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new NewThread(payload3))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title-xxxx',
      body: 'content-xxxx',
      owner: 'user-xxx'
    }

    // Action
    const newThread = new NewThread(payload)

    // Assert
    expect(newThread.title).toEqual(payload.title)
    expect(newThread.body).toEqual(payload.body)
    expect(newThread.owner).toEqual(payload.owner)
  })
})
