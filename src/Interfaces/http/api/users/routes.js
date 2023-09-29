export default (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  }
])
