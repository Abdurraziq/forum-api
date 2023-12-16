import fakePool from '../../../../tests/fakePool.js'
import pool from '../../database/postgres/pool.js'
import HealthStatusRepositoryPostgres from '../HealthStatusRepositoryPostgres.js'

describe('HealthStatusRepository postgres', () => {
  describe('getStatus function', () => {
    it('should thrown error if database connection is failed', async () => {
      // Arrange
      const healthStatusRepository = new HealthStatusRepositoryPostgres(fakePool)

      // Assert
      await expect(healthStatusRepository.getStatus()).rejects.toThrow()
    })

    it('should not thrown error if database connection is succsess', async () => {
      // Arrange
      const healthStatusRepository = new HealthStatusRepositoryPostgres(pool)

      // Assert
      await expect(healthStatusRepository.getStatus()).resolves.not.toThrowError()
    })
  })
})
