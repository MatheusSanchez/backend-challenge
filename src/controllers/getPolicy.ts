import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchPolicyUseCase } from '../use-cases/fetchPolicy'
import { ResourceNotFoundError } from '../use-cases/errors/resourceNotFound'

const policyRepository: PolicyRepository =
  InMemomryPolicyRepository.getInstance()
const fetchPolicyUseCase = new FetchPolicyUseCase(policyRepository)

export async function getPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName } = request.params

  let policy

  try {
    policy = await fetchPolicyUseCase.execute({ policyName })
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: e.message })
    }

    throw e
  }

  return response.status(201).send(policy)
}
