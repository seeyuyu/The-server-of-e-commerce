var development_env = require('./development')
var dev_ali_env = require('./dev-ali')

//根据不同的NODE_ENV,输出不同的配置对象，默认输出development

module.exports = {
  development:development_env,
  dev_ali:dev_ali_env,
}[process.env.NODE_ENV || 'development']