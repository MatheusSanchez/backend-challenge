import { PolicyRepository } from '../repositories/policyRepository'

interface DeletePolicyRequest {
  policyName: string
}

export class DeletePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({ policyName }: DeletePolicyRequest): Promise<boolean> {
    return await this.policyRepository.deleteByPolicyName(policyName)
  }
}
