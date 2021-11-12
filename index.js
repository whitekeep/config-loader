const Ajv = require('ajv');
const ajv = new Ajv();
const path = require('path');

function loadConfig(config_folder) {
  // стандартный конфиг
  try {
    def_path = path.join('../../', config_folder, 'config_default.json');
    sch_path = path.join('../../', config_folder, 'config_schema.json');
    var config_default = require(def_path);
    var validate = ajv.compile(require(sch_path));
    if (config_default.config_validate == true) {
      if (!validate(config_default)) {
        console.log(validate.errors);
        return 0;
      }
    }
  } catch (err) {
    console.log(err);
    return;
  }

  // подключаем логгер loadConfig
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

  try {
    conf_path = path.join('../../', config_folder, 'config.json');
    var config = require(conf_path);
    if (config.config_validate == true) {
      if (!validate(config)) {
        throw validate.errors;
        //todo: логгирование
      }
    }
    log.info('Конфигурация загружена');
  } catch (err) {
    log.info('Не удается загрузить конфигурационный файл');
    log.error(err);
    log.info('Загрузка конфигурации по умолчанию');
    config = config_default;
  }
  //todo: остановка приложения при ломанном дефолтном конфиге
  return config;
}

module.exports = loadConfig;
