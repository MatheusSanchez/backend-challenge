import { Policy, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PolicyRepository } from '../policyRepository'

export class InMemomryPolicyRepository implements PolicyRepository {
  public db: Policy[] = []

  async create(policy: Prisma.PolicyCreateInput) {
    const newPolicy: Policy = {
      id: policy.id ? policy.id : randomUUID(),
      name: policy.name,
      comparators: (policy.comparators
        ? policy.comparators
        : []) as Prisma.JsonValue,
    }

    this.db.push(newPolicy)
    return this.db[this.db.length - 1]
  }
}
