export class OperatorNotExistError extends Error {
  constructor() {
    super('Comparator Not implemented')
  }
}
