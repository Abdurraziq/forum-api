const AddedComment = require('../AddedComment')

describe('an AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'comment-xxxx',
      content: 'comments'
    }
    const payload2 = {
      id: 'comment-xxxx',
      owner: 'user-xxxx'
    }
    const payload3 = {
      content: 'comments',
      owner: 'user-xxxx'
    }

    // Action and Assert
    expect(() => new AddedComment(payload1))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedComment(payload2))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    expect(() => new AddedComment(payload3))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 12345,
      content: null,
      owner: false
    }
    const payload2 = {
      id: '12345',
      content: {},
      owner: []
    }
    const payload3 = {
      id: 12345,
      content: null,
      owner: true
    }

    // Action and Assert
    expect(() => new AddedComment(payload1))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedComment(payload2))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    expect(() => new AddedComment(payload3))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxxxxx',
      content: 'comments',
      owner: 'user-xxxxxx'
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.owner).toEqual(payload.owner)
    expect(addedComment.content).toEqual(payload.content)
  })
})
