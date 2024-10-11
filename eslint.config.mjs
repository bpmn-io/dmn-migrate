import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

export default [
  {
    ignores: [
      'dist'
    ]
  },
  ...bpmnIoPlugin.configs.recommended,
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: [
        'test/**/*.js'
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
