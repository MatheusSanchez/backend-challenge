import { expect, beforeEach, describe, it } from 'vitest'
import { PolicyRepository } from '../repositories/policyRepository'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { DeletePolicyUseCase } from './deletePolicy'
import { ResourceNotFoundError } from './errors/resourceNotFound'

let policyRepository: PolicyRepository
let deletePolicyUseCase: DeletePolicyUseCase

describe('Delete Policy Use Case', () => {
  beforeEach(async () => {
    policyRepository = new InMemomryPolicyRepository()
    deletePolicyUseCase = new DeletePolicyUseCase(policyRepository)
  })

  it('should be able to delete a Policy', async () => {
    await policyRepository.create({
      policyName: 'policyTestToDelete',
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

    const deletedPolicy = await deletePolicyUseCase.execute({
      policyName: 'policyTestToDelete',
    })

    expect(deletedPolicy.policyName).toEqual('policyTestToDelete')
    expect(deletedPolicy.comparators).toHaveLength(2)
  })

  it('should not be able to delete a Policy that does not exist', async () => {
    await policyRepository.create({
      policyName: 'wrongPolicy',
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

    await expect(() =>
      deletePolicyUseCase.execute({
        policyName: 'policyThatDoNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
