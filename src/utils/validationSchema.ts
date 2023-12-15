const comparatorsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    label: { type: 'string' },
    operator: { type: 'string' },
    referenceValue: { type: 'string' },
    result: { type: 'boolean' },
    type: { type: 'string', enum: ['result', 'compare', 'start'] },
    order: { type: 'number' },
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
    'order',
  ],
}

const bodyJsonSchema = {
  type: 'object',
  required: ['policyName', 'comparators'],
  properties: {
    policyName: { type: 'string' },
    comparators: {
      type: ['array'],
      items: comparatorsSchema,
    },
  },
}
export const schema = {
  body: bodyJsonSchema,
}
