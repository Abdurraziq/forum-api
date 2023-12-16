import HealthStatusRepository from '../../../Domains/health-status/HealthStatusRepository.js'
import GetHealthStatusUseCase from '../GetHealthStatusUseCase.js'

describe('GetHealthStatusUseCase', () => {
  it('should orchestrating the get health status correctly', async () => {
    // Arrange
    const mockGoodHealthStatusRepository = new HealthStatusRepository()
    const mockBadHealthStatusRepository = new HealthStatusRepository()

    // Mocking
    mockGoodHealthStatusRepository.getStatus = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockBadHealthStatusRepository.getStatus = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()))

    // create use case instance
    const getGoodHealthStatusUseCase = new GetHealthStatusUseCase({
      healthStatusRepository: mockGoodHealthStatusRepository
    })

    const getBadHealthStatusUseCase = new GetHealthStatusUseCase({
      healthStatusRepository: mockBadHealthStatusRepository
    })

    // Action and Assert
    await expect(getGoodHealthStatusUseCase.execute()).resolves.not.toThrowError()
    await expect(getBadHealthStatusUseCase.execute()).rejects.toThrowError()
    expect(mockGoodHealthStatusRepository.getStatus).toBeCalled()
    expect(mockBadHealthStatusRepository.getStatus).toBeCalled()
  })
})
