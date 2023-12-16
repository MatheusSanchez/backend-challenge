import { PolicyRepository } from '../repositories/policyRepository'
import {
  ComparatorsTS,
  TestLabelValue,
  mapperToPolicyTSObject,
} from '../utils/validationSchema'
import { ResourceNotFoundError } from './errors/resourceNotFound'

interface ExecutePolicyRequest {
  policyName: string
  tests: TestLabelValue[]
}

interface ExecutePolicyResponse {
  result: boolean
}

export class ExecutePolicyUseCase {
  constructor(private policyRepository: PolicyRepository) {}

  async execute({
    policyName,
    tests,
  }: ExecutePolicyRequest): Promise<ExecutePolicyResponse> {
    const policiesDB = await this.policyRepository.findByPolicyName(policyName)

    if (!policiesDB) {
      throw new ResourceNotFoundError()
    }
    const policies = mapperToPolicyTSObject(policiesDB)

    const labelsFromRequest = tests.map((test) => test.label)

    const notResultComparators = policies.comparators.filter(
      (comparator) =>
        comparator.label !== 'result' && comparator.label !== undefined,
    )
    console.log('notResultComparators')
    console.log(notResultComparators)

    const labelsRequired = notResultComparators.map(
      (comparator) => comparator.label,
    ) as string[]

    console.log('labelsRequired')
    console.log(labelsRequired)

    for (let i = 0; i < labelsRequired.length; i++) {
      if (labelsFromRequest.indexOf(labelsRequired[i]) === -1) {
        throw new Error('Missing Label ' + labelsRequired[i])
      }
    }

    if (labelsFromRequest.length > labelsRequired.length) {
      throw new Error('You Input more labels than this Policy Needs ')
    }

    const startComparator: ComparatorsTS = policies.comparators.find(
      (comparator) => {
        return comparator.type === 'start'
      },
    ) as ComparatorsTS

    return {
      result: executionEngine(tests, policies.comparators, startComparator),
    }
  }
}

function executionEngine(
  tests: TestLabelValue[],
  comparators: ComparatorsTS[],
  actualComparator: ComparatorsTS,
): boolean {
  console.log('actualComparator')
  console.log(actualComparator)
  if (actualComparator.type === 'result') {
    return actualComparator.result as boolean
  }

  const currentTest: TestLabelValue = tests.find((test) => {
    return test.label === actualComparator.label
  }) as TestLabelValue

  if (decider(actualComparator, currentTest)) {
    const nextComparator: ComparatorsTS = comparators.find((comparator) => {
      return comparator.id === actualComparator.truePath
    }) as ComparatorsTS

    return executionEngine(tests, comparators, nextComparator)
  }

  const nextComparator: ComparatorsTS = comparators.find((comparator) => {
    return comparator.id === actualComparator.falsePath
  }) as ComparatorsTS

  return executionEngine(tests, comparators, nextComparator)
}

function decider(comparator: ComparatorsTS, test: TestLabelValue) {
  switch (comparator.operator) {
    case '=':
      return comparator.referenceValue === test.value
    case '>=':
      return test.value >= comparator.referenceValue
    case '<=':
      return test.value <= comparator.referenceValue
    case '>':
      return test.value > comparator.referenceValue
    case '<':
      return test.value < comparator.referenceValue
    default:
      console.log('This Operator does not exist')
      throw new Error('This Operator does not exist')
  }
}
