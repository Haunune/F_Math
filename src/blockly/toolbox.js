export const toolbox = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Logic',
        categorystyle: 'logic_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_if',
          },
          {
            kind: 'block',
            type: 'logic_compare',
          },
          {
            kind: 'block',
            type: 'logic_operation',
          },
          {
            kind: 'block',
            type: 'logic_negate',
          },
          {
            kind: 'block',
            type: 'logic_boolean',
          },
          {
            kind: 'block',
            type: 'logic_null',
          },
          {
            kind: 'block',
            type: 'logic_ternary',
          },
        ],
        scrollbars: false
      },
      {
        kind: 'category',
        name: 'Math',
        categorystyle: 'math_category',
        contents: [
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
          },
          {
            kind: 'block',
            type: 'math_single',
            collapse: true,
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 9,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_trig',
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 45,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_constant',
            collapse: true
          },
          {
            kind: 'block',
            type: 'math_number_property',
            collapse: true,
            inputs: {
              NUMBER_TO_CHECK: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 0,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_round',
            collapse: true,
            fields: {
              OP: 'ROUND',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 3.1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_on_list',
            collapse: true,
            fields: {
              OP: 'SUM',
            },
          },
        ],
        scrollbars: false
      },
      {
        kind: 'category',
        name: 'Variables',
        categorystyle: 'variable_category',
        custom: 'VARIABLE',
      },
      {
        kind: 'category',
        name: 'Functions',
        categorystyle: 'procedure_category',
        custom: 'PROCEDURE',
      },
    ],
  };