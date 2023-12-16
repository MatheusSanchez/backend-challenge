import { Prisma } from '@prisma/client'
import { PolicyRepository } from '../policyRepository'
import { prisma } from '../../lib/prisma'

export class PrismaPolicyRepository implements PolicyRepository {
  async create(policy: Prisma.PolicyCreateInput) {
    const newPolicy = await prisma.policy.create({ data: policy })
    return newPolicy
  }

  async findByPolicyName(policyName: string) {
    const policy = await prisma.policy.findUnique({ where: { policyName } })

    return policy
  }

  async fetchAll() {
    const policies = await prisma.policy.findMany()

    return policies
  }

  async deleteByPolicyName(policyName: string) {
    try {
      await prisma.policy.delete({
        where: {
          policyName,
        },
      })
    } catch (e) {
      console.log(e)
    }

    return true
  }
}
