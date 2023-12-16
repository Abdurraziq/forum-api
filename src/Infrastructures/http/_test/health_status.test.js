import container from '../../container.js'
import createServer from '../createServer.js'

describe('/health-status endpoint', () => {
  describe('when GET /health-status', () => {
    it('should response 200', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/health-status'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('ok')
    })
  })
})
