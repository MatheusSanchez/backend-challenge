import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Get All Policies E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to get all policies', async () => {
    const allPoliciesLenght = 3

    for (let i = 0; i < allPoliciesLenght; i++) {
      await request(app.server)
        .post('/policy')
        .send({
          policyName: `policy-${i}`,
          comparators: [
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
    }

    const response = await request(app.server).get(`/policy/all`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.policies).toHaveLength(allPoliciesLenght)
  })
})
