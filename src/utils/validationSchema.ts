import { Policy } from '@prisma/client'

export type TestLabelValue = {
  label: string
  value: number
}

export type ComparatorsTS = {
  id: number
  label?: string
  operator?: string
  referenceValue?: number
  result?: boolean
  type: 'result' | 'compare' | 'start'
  truePath?: number
  falsePath?: number
}

export type PolicyTS = {
  policyName: string
  comparators: ComparatorsTS[]
}

export function mapperToPolicyTSObject(policy: Policy) {
  const policyTS: PolicyTS = {
    policyName: policy.policyName,
    comparators: policy.comparators.map((comparator) => {
      return {
        id: comparator.id,
        type: comparator.type,
        ...(comparator.label && { label: comparator.label }),
        ...(comparator.operator && { operator: comparator.operator }),
        ...(comparator.result !== undefined && { result: comparator.result }),
        ...(comparator.referenceValue && {
          referenceValue: comparator.referenceValue,
        }),
        ...(comparator.truePath && { truePath: comparator.truePath }),
        ...(comparator.falsePath && { falsePath: comparator.falsePath }),
      }
    }),
  }

  return policyTS
}
