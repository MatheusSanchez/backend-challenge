import { Policy, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PolicyRepository } from '../policyRepository'
import { ComparatorsTS } from '../../utils/validationSchema'

export class InMemomryPolicyRepository implements PolicyRepository {
  // eslint-disable-next-line no-use-before-define
  private static instance: InMemomryPolicyRepository | null
  private db: Policy[] = []

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): InMemomryPolicyRepository {
    if (!InMemomryPolicyRepository.instance) {
      InMemomryPolicyRepository.instance = new InMemomryPolicyRepository()
    }

    return InMemomryPolicyRepository.instance
  }

  async deleteByPolicyName(policyName: string): Promise<boolean> {
    let deleted = false
    this.db.forEach((policy, index) => {
      if (policy.policyName === policyName) {
        this.db.splice(index, 1)
        deleted = true
      }
    })

    return deleted
  }

  async create(policy: Prisma.PolicyCreateInput) {
    const newPolicy: Policy = {
      id: policy.id ? policy.id : randomUUID(),
      policyName: policy.policyName,
      comparators: policy.comparators
        ? (policy.comparators as ComparatorsTS[])
        : [],
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

  async fetchAll() {
    return this.db
  }
}
