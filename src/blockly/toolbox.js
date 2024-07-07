export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    {
      kind: 'block',
      type: 'logic_compare',
    },
    {
      kind: 'block',
      type: 'math_number',
      fields: {
        NUM: 123,
      },
      collapse: true
    },
    {
      kind: 'block',
      type: 'math_arithmetic',
      collapse: true,
      inputs: {
        A: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        B: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
      },
    }
  ],
};