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
