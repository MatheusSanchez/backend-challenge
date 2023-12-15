import { Policy, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PolicyRepository } from '../policyRepository'

export class InMemomryPolicyRepository implements PolicyRepository {
  public db: Policy[] = []

  async create(policy: Prisma.PolicyCreateInput) {
    const newPolicy: Policy = {
      id: policy.id ? policy.id : randomUUID(),
      policyName: policy.policyName,
      comparators: (policy.comparators
        ? policy.comparators
        : []) as Prisma.JsonValue,
    }

    this.db.push(newPolicy)
    return this.db[this.db.length - 1]
  }

  async findByPolicyName(policyName: string) {
    const policy = this.db.find((policy) => policy.policyName === policyName)

    if (!policy) {
      return null
    }

    return policy
  }
}
