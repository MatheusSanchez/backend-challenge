import { expect, beforeEach, describe, it } from 'vitest'
import { PolicyRepository } from '../repositories/policyRepository'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { ExecutePolicyUseCase } from './executePolicy'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import { MissingLabelError } from './errors/missingLabelError'
import { MoreLabelsThanExpectedError } from './errors/moreLabelsThanExpected'
import { ComparatorReferenceValueError } from './errors/comparatorReferenceValueError'
import { ComparatorNotExistError } from './errors/comparatorNotExistError'

let policyRepository: PolicyRepository
let executePolicyUseCase: ExecutePolicyUseCase

describe('Execute Policy Use Case', () => {
  beforeEach(async () => {
    policyRepository = new InMemomryPolicyRepository()
    executePolicyUseCase = new ExecutePolicyUseCase(policyRepository)
  })

  it('Should be able to Execute Policy returning true', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
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

    const { result } = await executePolicyUseCase.execute({
      policyName: 'FirstPolicy',
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

    expect(result).toBe(true)
  })

  it('Should be to Execute Policy returning false', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
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

    const { result } = await executePolicyUseCase.execute({
      policyName: 'FirstPolicy',
      tests: [
        {
          label: 'day',
          value: 10,
        },
        {
          label: 'creditScore',
          value: 10,
        },
        {
          label: 'dadScore',
          value: 10,
        },
      ],
    })

    expect(result).toBe(false)
  })

  it('Should not be able to Execute Policy that doo not exist', async () => {
    await expect(() =>
      executePolicyUseCase.execute({
        policyName: 'FirstPolicy',
        tests: [
          {
            label: 'day',
            value: 10,
          },
          {
            label: 'creditScore',
            value: 10,
          },
          {
            label: 'dadScore',
            value: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to Execute Policy without required labels', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
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
      ],
    })

    expect(
      async () =>
        await executePolicyUseCase.execute({
          policyName: 'FirstPolicy',
          tests: [
            {
              label: 'anyOtherLabel',
              value: 30,
            },
          ],
        }),
    ).rejects.toBeInstanceOf(MissingLabelError)
  })

  it('Should not be able to Execute Policy with more labels than expected', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
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
      ],
    })

    expect(
      async () =>
        await executePolicyUseCase.execute({
          policyName: 'FirstPolicy',
          tests: [
            {
              label: 'day',
              value: 30,
            },
            {
              label: 'labelThatNotExist',
              value: 30,
            },
          ],
        }),
    ).rejects.toBeInstanceOf(MoreLabelsThanExpectedError)
  })

  it('Should not be able to Execute Policy with a comparator without reference value', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
      comparators: [
        {
          id: 1,
          label: 'day',
          operator: '=',
          type: 'start',
          truePath: 2,
          falsePath: 5,
        },
      ],
    })

    expect(
      async () =>
        await executePolicyUseCase.execute({
          policyName: 'FirstPolicy',
          tests: [
            {
              label: 'day',
              value: 30,
            },
          ],
        }),
    ).rejects.toBeInstanceOf(ComparatorReferenceValueError)
  })

  it('Should not be able to Execute Policy with a unknown operator', async () => {
    await policyRepository.create({
      policyName: 'FirstPolicy',
      comparators: [
        {
          id: 1,
          label: 'day',
          operator: 'unknownOperator',
          referenceValue: 30,
          type: 'start',
          truePath: 2,
          falsePath: 5,
        },
      ],
    })

    expect(
      async () =>
        await executePolicyUseCase.execute({
          policyName: 'FirstPolicy',
          tests: [
            {
              label: 'day',
              value: 30,
            },
          ],
        }),
    ).rejects.toBeInstanceOf(ComparatorNotExistError)
  })
})
