import HealthStatusRepository from '../HealthStatusRepository.js'

describe('HealthStatusRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const healthStatusRepository = new HealthStatusRepository()

    // Action and Assert
    await expect(healthStatusRepository.getStatus())
      .rejects.toThrowError('HEALTH_STATUS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
