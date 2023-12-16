export class PolicyAlreadyExistError extends Error {
  constructor() {
    super('Policy already exist !')
  }
}
