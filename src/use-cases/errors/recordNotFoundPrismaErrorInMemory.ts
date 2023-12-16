// This class represents the "RecordNotFound" from Prisma, which we will use for testing with the in-memory database strategy.

export class RecordNotFoundPrismaErrorInMemory extends Error {
  code = 'P2025'
}
