const comparatorsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    label: { type: 'string' },
    operator: { type: 'string' },
    referenceValue: { type: 'string' },
    result: { type: 'boolean' },
    type: { type: 'string', enum: ['result', 'compare', 'start'] },
    policyAge: { type: 'number' },
    truePath: { type: ['array', 'null'], items: { type: 'integer' } },
    falsePath: { type: ['array', 'null'], items: { type: 'integer' } },
  },
  required: [
    'id',
    'label',
    'operator',
    'referenceValue',
    'result',
    'type',
    'policyAge',
  ],
}

const bodyJsonSchema = {
  type: 'object',
  required: ['name', 'comparators'],
  properties: {
    name: { type: 'string' },
    comparators: comparatorsSchema,
  },
}
export const schema = {
  body: bodyJsonSchema,
}
