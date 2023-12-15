import { Policy, Prisma } from '@prisma/client'

export interface PolicyRepository {
  create(policy: Prisma.PolicyCreateInput): Promise<Policy>
}
