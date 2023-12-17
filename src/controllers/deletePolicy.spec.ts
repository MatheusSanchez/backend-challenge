import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Delete Policy E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able delete a policy', async () => {
    const policyName = 'policyToBeDeleted'

    await request(app.server)
      .post('/policy')
      .send({
        policyName,
        comparators: [
          {
            id: 1,
            label: 'day',
            operator: '=',
            referenceValue: 30,
            type: 'start',
            truePath: 2,
            falsePath: 5,
          },
          {
            id: 2,
            label: 'creditScore',
            operator: '>=',
            referenceValue: 8000,
            type: 'compare',
            truePath: 3,
            falsePath: 6,
          },
          {
            id: 3,
            label: 'dadScore',
            operator: '>=',
            referenceValue: 16000,
            type: 'compare',
            truePath: 4,
            falsePath: 7,
          },
          {
            id: 4,
            type: 'result',
            result: true,
          },
          {
            id: 5,
            type: 'result',
            result: false,
          },
          {
            id: 6,
            type: 'result',
            result: false,
          },
          {
            id: 7,
            type: 'result',
            result: false,
          },
        ],
      })

    const response = await request(app.server).delete(`/policy/${policyName}`)
    expect(response.statusCode).toEqual(200)
  })

  it('should not be able delete a policy that does not exist', async () => {
    const policyName = 'inexistentPolicy'

    const response = await request(app.server).delete(`/policy/${policyName}`)
    expect(response.statusCode).toEqual(202)
  })
})
