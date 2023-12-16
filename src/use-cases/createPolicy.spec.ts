import { expect, beforeEach, describe, it } from 'vitest'
import { PolicyRepository } from '../repositories/policyRepository'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { CreatePolicyUseCase } from './createPolicy'
import { PolicyAlreadyExistError } from './errors/policyAlreadyExist'

let policyRepository: PolicyRepository
let createPolicyUseCase: CreatePolicyUseCase

describe('Create Policy Use Case', () => {
  beforeEach(async () => {
    policyRepository = new InMemomryPolicyRepository()
    createPolicyUseCase = new CreatePolicyUseCase(policyRepository)
  })

  it('should be able to create a Policy', async () => {
    const { policy } = await createPolicyUseCase.execute({
      policyName: 'policyTest',
      comparators: [
        {
          id: 1,
          type: 'result',
          result: false,
        },
        {
          id: 2,
          type: 'result',
          result: true,
        },
      ],
    })

    expect(policy.policyName).toEqual('policyTest')
    expect(policy.comparators).toHaveLength(2)

    expect(policy.comparators).toEqual([
      expect.objectContaining({ id: 1 }),
      expect.objectContaining({ id: 2 }),
    ])
  })

  it('should not be able to create a Policy tha already exist', async () => {
    await createPolicyUseCase.execute({
      policyName: 'policyTest',
      comparators: [
        {
          id: 1,
          type: 'result',
          result: false,
        },
        {
          id: 2,
          type: 'result',
          result: true,
        },
      ],
    })

    expect(
      async () =>
        await createPolicyUseCase.execute({
          policyName: 'policyTest',
          comparators: [
            {
              id: 1,
              type: 'result',
              result: false,
            },
            {
              id: 2,
              type: 'result',
              result: true,
            },
          ],
        }),
    ).rejects.toBeInstanceOf(PolicyAlreadyExistError)
  })
})
