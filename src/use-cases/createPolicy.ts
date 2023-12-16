import { Policy } from '@prisma/client'
import { PolicyRepository } from '../repositories/policyRepository'
import { PolicyAlreadyExistError } from './errors/policyAlreadyExist'
import { PolicyTS } from '../utils/validationSchema'

interface CreatePolicyResponse {
  policy: Policy
}

export class CreatePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({
    policyName,
    comparators,
  }: PolicyTS): Promise<CreatePolicyResponse> {
    const policyAlreadyExist =
      await this.policyRepository.findByPolicyName(policyName)

    if (policyAlreadyExist) {
      throw new PolicyAlreadyExistError()
    }

    const policy = await this.policyRepository.create({
      policyName,
      comparators,
    })

    return { policy }
  }
}
