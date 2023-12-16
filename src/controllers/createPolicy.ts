import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { CreatePolicyUseCase } from '../use-cases/createPolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'
import { PolicyAlreadyExistError } from '../use-cases/errors/policyAlreadyExist'
import { z } from 'zod'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const createPolicyUseCase = new CreatePolicyUseCase(policyRepository)

export async function createPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const comparatorSchmea = z.object({
    id: z.number().int(),
    type: z.union([
      z.literal('result'),
      z.literal('compare'),
      z.literal('start'),
    ]),
    label: z.string().optional(),
    operator: z.string().optional(),
    referenceValue: z.number().optional(),
    result: z.boolean().optional(),
    truePath: z.number().int().optional(),
    falsePath: z.number().int().optional(),
  })

  const policyBodySchmea = z.object({
    policyName: z.string(),
    comparators: z.array(comparatorSchmea),
  })

  const { policyName, comparators } = policyBodySchmea.parse(request.body)

  let newPolicy

  try {
    newPolicy = await createPolicyUseCase.execute({
      policyName,
      comparators,
    })
  } catch (e) {
    if (e instanceof PolicyAlreadyExistError) {
      return response.status(409).send({ message: e.message })
    }

    throw e
  }

  return response.status(201).send(newPolicy)
}
