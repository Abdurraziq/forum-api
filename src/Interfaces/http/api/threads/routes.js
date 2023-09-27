const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThread,
    options: {
      auth: 'garuda_forum_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThread
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postComment,
    options: {
      auth: 'garuda_forum_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteComment,
    options: {
      auth: 'garuda_forum_jwt'
    }
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReply,
    options: {
      auth: 'garuda_forum_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReply,
    options: {
      auth: 'garuda_forum_jwt'
    }
  }
])

module.exports = routes
