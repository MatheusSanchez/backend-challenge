import { expect, beforeEach, describe, it } from 'vitest'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchAllPoliciesUseCase } from './fetchAllPolicies'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'

let policyRepository: PolicyRepository
let fetchAllPoliciesUseCase: FetchAllPoliciesUseCase

describe('Fetch All Policies Use Case', () => {
  beforeEach(async () => {
    policyRepository = new InMemomryPolicyRepository()
    fetchAllPoliciesUseCase = new FetchAllPoliciesUseCase(policyRepository)
  })

  it('should be to get all Policies', async () => {
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

    const { policies } = await fetchAllPoliciesUseCase.execute()

    expect(policies).toHaveLength(2)
    expect(policies[0].id).toEqual(expect.any(String))
    expect(policies[1].id).toEqual(expect.any(String))
  })
})
