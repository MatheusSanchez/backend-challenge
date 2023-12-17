import { PolicyRepository } from '../repositories/policyRepository'
import { ComparatorsTS, PolicyTS, TestLabelValue } from '../utils/PolicyTypes'
import { MissingLabelError } from './errors/missingLabelError'
import { OperatorNotExistError } from './errors/comparatorNotExistError'
import { MoreLabelsThanExpectedError } from './errors/moreLabelsThanExpected'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import { ComparatorReferenceValueError } from './errors/comparatorReferenceValueError'

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

    const policies: PolicyTS = {
      policyName: policiesDB.policyName,
      comparators: policiesDB.comparators as ComparatorsTS[],
    }

    const labelsFromRequest = tests.map((test) => test.label)

    const notResultComparators = policies.comparators.filter(
      (comparator) => comparator.label && comparator.label !== 'result',
    )

    const labelsRequired = notResultComparators.map(
      (comparator) => comparator.label,
    ) as string[]

    for (let i = 0; i < labelsRequired.length; i++) {
      if (labelsFromRequest.indexOf(labelsRequired[i]) === -1) {
        throw new MissingLabelError(labelsRequired[i])
      }
    }

    if (labelsFromRequest.length > labelsRequired.length) {
      throw new MoreLabelsThanExpectedError()
    }

    const startComparator = policies.comparators.find((comparator) => {
      return comparator.type === 'start'
    }) as ComparatorsTS

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
  if (comparator.referenceValue === undefined) {
    console.log(comparator)
    throw new ComparatorReferenceValueError()
  }

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
      throw new OperatorNotExistError()
  }
}
