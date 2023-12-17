import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Execute Policy E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to execute a policy', async () => {
    const policyName = 'policyToBeExecuted'

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

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'day',
            value: 30,
          },
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
        ],
      })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({ result: true }))
  })

  it('should not be able to execute a policy that does not exist', async () => {
    const policyName = 'inexistentPolicy'

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'day',
            value: 30,
          },
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
        ],
      })
    console.log(response.body)
    expect(response.statusCode).toEqual(404)
  })

  it('should not be able to execute a policy missing required labels', async () => {
    const policyName = 'policyToBeExecuted'

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
        ],
      })

    expect(response.statusCode).toEqual(400)
  })

  it('should not be able to execute a policy adding more labels than registered', async () => {
    const policyName = 'policyToBeExecuted'

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'day',
            value: 30,
          },
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
          {
            label: 'thisLabelIsNotNecessary',
            value: 20000,
          },
        ],
      })

    expect(response.statusCode).toEqual(422)
  })

  it('should not be able to execute a policy with a comparator reference undefinied', async () => {
    const policyName = 'policyToBeExecutedTwo'

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

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'day',
            value: 30,
          },
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
        ],
      })
    expect(response.statusCode).toEqual(500)
  })

  it('should not be able to execute a policy with a operator that is unkown', async () => {
    const policyName = 'policyWithAnOperatorError'

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
            operator: 'iDontKnowHowToProcessThis!',
            referenceValue: 8000,
            type: 'compare',
            truePath: 3,
            falsePath: 6,
          },
          {
            id: 3,
            label: 'dadScore',
            operator: '>=',
            referenceValue: 8000,
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

    const response = await request(app.server)
      .post(`/execute`)
      .send({
        policyName,
        tests: [
          {
            label: 'day',
            value: 30,
          },
          {
            label: 'creditScore',
            value: 90000,
          },
          {
            label: 'dadScore',
            value: 20000,
          },
        ],
      })
    expect(response.statusCode).toEqual(403)
  })
})
