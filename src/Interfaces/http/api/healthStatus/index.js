import routes from './routes.js'
import HealthStatusHandler from './handler.js'

export default {
  name: 'health-status',
  register: async (server, { container }) => {
    const healthStatusHandler = new HealthStatusHandler(container)
    server.route(routes(healthStatusHandler))
  }
}
