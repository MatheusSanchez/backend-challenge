import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Get Policy E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to get a policy', async () => {
    const policyName = 'policyToGet'

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

    const response = await request(app.server).get(`/policy/${policyName}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.policy).toEqual(
      expect.objectContaining({ policyName }),
    )
  })

  it.only('should not be able to get a policy that do not exist', async () => {
    const policyName = 'inexistentPolicy'

    const response = await request(app.server).get(`/policy/${policyName}`)

    expect(response.statusCode).toEqual(404)
  })
})
