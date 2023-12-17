import { expect, beforeEach, describe, it } from 'vitest'
import { PolicyRepository } from '../repositories/policyRepository'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { FetchPolicyUseCase } from './fetchPolicy'
import { ResourceNotFoundError } from './errors/resourceNotFound'

let policyRepository: PolicyRepository
let fetchPolicyUseCase: FetchPolicyUseCase

describe('Fetch Policy Use Case', () => {
  beforeEach(async () => {
    policyRepository = new InMemomryPolicyRepository()
    fetchPolicyUseCase = new FetchPolicyUseCase(policyRepository)
  })

  it('should be able to get a Policy', async () => {
    await policyRepository.create({
      policyName: 'policyTestOne',
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

    await policyRepository.create({
      policyName: 'policyTestTwo',
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

    const { policy: policyTestOne } = await fetchPolicyUseCase.execute({
      policyName: 'policyTestOne',
    })

    const { policy: policyTestTwo } = await fetchPolicyUseCase.execute({
      policyName: 'policyTestTwo',
    })

    expect(policyTestOne.policyName).toEqual('policyTestOne')
    expect(policyTestTwo.policyName).toEqual('policyTestTwo')

    expect(policyTestOne.comparators).toHaveLength(2)
    expect(policyTestTwo.comparators).toHaveLength(2)
  })

  it('should not be able to get a Policy that does not exist', async () => {
    await expect(() =>
      fetchPolicyUseCase.execute({
        policyName: 'policyThatDoNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
