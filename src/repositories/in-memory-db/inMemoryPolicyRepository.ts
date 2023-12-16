import { Policy, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PolicyRepository } from '../policyRepository'
import { ComparatorsTS } from '../../utils/validationSchema'
import { RecordNotFoundPrismaErrorInMemory } from '../../use-cases/errors/recordNotFoundPrismaErrorInMemory'

export class InMemomryPolicyRepository implements PolicyRepository {
  private db: Policy[] = []

  async deleteByPolicyName(policyName: string) {
    let deleted: Policy = {} as Policy

    this.db.forEach((policy, index) => {
      if (policy.policyName === policyName) {
        deleted = this.db[index]
        this.db.splice(index, 1)
      }
    })

    if (deleted.id === undefined) {
      throw new RecordNotFoundPrismaErrorInMemory('inMemoryDBError')
    }

    return deleted
  }

  async create(policy: Prisma.PolicyCreateInput) {
    const newPolicy: Policy = {
      id: randomUUID(),
      policyName: policy.policyName,
      comparators: policy.comparators as ComparatorsTS[],
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
