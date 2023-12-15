import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'

interface FetchAllPoliciesResponse {
  policies: Policy[]
}

export class FetchAllPoliciesUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute(): Promise<FetchAllPoliciesResponse> {
    const policies = await this.policyRepository.fetchAll()

    return { policies }
  }
}
