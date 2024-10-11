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
      ],
      languageOptions: {
        globals: {
          ...config.languageOptions.globals,
          require: false
        }
      }
    };
  })
];
