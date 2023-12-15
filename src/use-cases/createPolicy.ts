import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'

interface CreatePolicyRequest {
  policyName: string
  comparators: JSON
}

interface CreatePolicyResponse {
  policy: Policy
}

export class CreatePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({
    policyName,
    comparators,
  }: CreatePolicyRequest): Promise<CreatePolicyResponse> {
    const policyAlreadyExist =
      await this.policyRepository.findByPolicyName(policyName)

    if (!policyAlreadyExist) {
      throw new Error('policy already exist')
    }

    const policy = await this.policyRepository.create({
      policyName,
      comparators,
    })

    return { policy }
  }
}
