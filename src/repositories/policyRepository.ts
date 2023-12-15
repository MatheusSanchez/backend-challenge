import { Policy, Prisma } from '@prisma/client'

export interface PolicyRepository {
  create(policy: Prisma.PolicyCreateInput): Promise<Policy>
  findByPolicyName(policyName: string): Promise<Policy | null>
  fetchAll(): Promise<Policy[]>
}
