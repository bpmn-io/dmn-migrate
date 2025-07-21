import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

export default [
  {
    ignores: [
      'dist'
    ]
  },

  // lib
  ...bpmnIoPlugin.configs.recommended,

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: [
        'test/**/*.js',
        'test/**/*.cjs'
      ]
    };
  }),
  {
    files: [
      'test/**/*.js'
    ],
    languageOptions: {
      globals: {
        require: false
      }
    }
  }
];
