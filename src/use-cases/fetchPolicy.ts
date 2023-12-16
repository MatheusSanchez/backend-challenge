import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'
import { ResourceNotFoundError } from './errors/resourceNotFound'

interface FetchPolicyResponse {
  policy: Policy
}

interface FetchPolicyRequest {
  policyName: string
}

export class FetchPolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({
    policyName,
  }: FetchPolicyRequest): Promise<FetchPolicyResponse> {
    const policy = await this.policyRepository.findByPolicyName(policyName)

    if (!policy) {
      throw new ResourceNotFoundError()
    }

    return { policy }
  }
}
