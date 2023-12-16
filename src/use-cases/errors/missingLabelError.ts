export class MissingLabelError extends Error {
  constructor(label: string) {
    super(`Missing Lable ${label}`)
  }
}
