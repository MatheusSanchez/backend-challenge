import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'

interface CreatePolicyRequest {
  name: string
  comparators: JSON
}

interface CreatePolicyResponse {
  policy: Policy
}

export class CreatePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({
    name,
    comparators,
  }: CreatePolicyRequest): Promise<CreatePolicyResponse> {
    const policy = await this.policyRepository.create({
      name,
      comparators,
    })

    return { policy }
  }
}
