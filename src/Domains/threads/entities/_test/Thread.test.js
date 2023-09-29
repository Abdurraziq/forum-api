import Thread from '../Thread.js'

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'Thread title',
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z',
      username: 'userx'
    }
    const payload2 = {
      id: 'thread-xxxx',
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z',
      username: 'userx'
    }
    const payload3 = {
      id: 'thread-xxxx',
      title: 'Thread title',
      date: '2023-09-18T07:19:09.775Z',
      username: 'userx'
    }
    const payload4 = {
      id: 'thread-xxxx',
      title: 'Thread title',
      body: 'Thread body content',
      username: 'userx'
    }
    const payload5 = {
      id: 'thread-xxxx',
      title: 'Thread title',
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z'
    }

    // Action and Assert
    expect(() => new Thread(payload1))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Thread(payload2))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Thread(payload3))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Thread(payload4))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new Thread(payload5))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123456,
      title: false,
      body: {},
      date: [],
      username: 'userx'
    }
    const payload2 = {
      id: 12.4546,
      title: true,
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z',
      username: {}
    }
    const payload3 = {
      id: 12_000,
      title: false,
      body: null,
      date: 0,
      username: null
    }

    // Action and Assert
    expect(() => new Thread(payload1))
      .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Thread(payload2))
      .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new Thread(payload3))
      .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-xxxx',
      title: 'Thread title',
      body: 'Thread body content',
      date: '2023-09-18T07:19:09.775Z',
      username: 'userx'
    }

    // Action
    const thread = new Thread(payload)

    // Assert
    expect(thread.id).toEqual(payload.id)
    expect(thread.title).toEqual(payload.title)
    expect(thread.body).toEqual(payload.body)
    expect(thread.date).toEqual(payload.date)
    expect(thread.username).toEqual(payload.username)
  })
})
