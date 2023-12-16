import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'
import { ResourceNotFoundError } from './errors/resourceNotFound'

interface DeletePolicyRequest {
  policyName: string
}

export class DeletePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({ policyName }: DeletePolicyRequest): Promise<Policy> {
    let deletedPolicy
    try {
      deletedPolicy = await this.policyRepository.deleteByPolicyName(policyName)
    } catch (e) {
      if (e.code === 'P2025') {
        // RecordNotFound execption Prisma
        throw new ResourceNotFoundError()
      }

      throw e
    }

    return deletedPolicy as Policy
  }
}
