const Ajv = require('ajv');
const path = require('path');
const process = require('process');

const ajv = new Ajv();

function loadConfig(config_folder) {
  // check default config
  try {
    def_path = path.join('../../', config_folder, 'config_default.json');
    sch_path = path.join('../../', config_folder, 'config_schema.json');
    var config_default = require(def_path);
    var validate = ajv.compile(require(sch_path));
    if (config_default.config_validate == true) {
      if (!validate(config_default)) {
        throw validate.errors;
      }
    }
  } catch (err) {
    // exit if error with loading default config
    console.log(err);
    console.log(`error load configuration. exit.`);
    process.exit(1);
  }

  // init logger (log-my-ass npm pckg)
  conf_logger = {
    info: {
      console_output: true,
      file_write: false,
      file_path: '../path/to/file.log',
    },
    error: {
      console_output: true,
      file_write: false,
      file_path: '../path/to/file.log',
    },
    access: {
      console_output: false,
      file_write: false,
      file_path: '../path/to/file.log',
    },
  };
  const Logger = require('log-my-ass');
  const log = new Logger(conf_logger, 'ConfigLoader');

  // load normal config
  try {
    conf_path = path.join('../../', config_folder, 'config.json');
    var config = require(conf_path);
    if (config.config_validate == true) {
      if (!validate(config)) {
        throw validate.errors;
      }
    }
    log.info('Конфигурация загружена');
  } catch (err) {
    // error with load normal config
    log.error(err, 'Не удается загрузить конфигурационный файл');
    log.info('Загрузка конфигурации по умолчанию');
    config = config_default;
  }

  return config;
}

module.exports = loadConfig;
