import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { CreatePolicyUseCase } from '../use-cases/createPolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'
import { PolicyAlreadyExistError } from '../use-cases/errors/policyAlreadyExist'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const createPolicyUseCase = new CreatePolicyUseCase(policyRepository)

export async function createPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName, comparators } = request.body

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
  }

  return response.status(201).send(newPolicy)
}
