export default (handler) => ([
  {
    method: 'GET',
    path: '/health-status',
    handler: handler.getHealthStatus
  }
])
