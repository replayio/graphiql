const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');
const cypressReplay = require("@replayio/cypress");

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  // @ts-ignore
  // require('@cypress/code-coverage/task')(on, config);
  cypressReplay.default(on, config);

  return config;
};
