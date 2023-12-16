import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { ExecutePolicyUseCase } from '../use-cases/executePolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'
import { ResourceNotFoundError } from '../use-cases/errors/resourceNotFound'
import { z } from 'zod'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const executePolicyUseCase = new ExecutePolicyUseCase(policyRepository)

export async function executePolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const testsValueExecutePolicyBodySchmea = z.object({
    label: z.string(),
    value: z.number(),
  })

  const executePolicyBodySchmea = z.object({
    policyName: z.string(),
    tests: z.array(testsValueExecutePolicyBodySchmea),
  })

  const { policyName, tests } = executePolicyBodySchmea.parse(request.body)

  let result

  try {
    result = await executePolicyUseCase.execute({
      policyName,
      tests,
    })
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: e.message })
    }

    throw e
  }

  return response.status(200).send(result)
}
