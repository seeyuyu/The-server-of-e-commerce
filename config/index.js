const development_env = require('./development')
const dev_ali_env = require('./dev-ali')

//根据不同的NODE_ENV,输出不同的配置对象，默认输出development
let  myConfig
console.log('process.env.NODE_ENV is ----->',process.env.NODE_ENV);

if(process.env.NODE_ENV =='dev_ali'){
  myConfig =dev_ali_env
}else {
  myConfig = development_env
}

module.exports = myConfig


// module.exports = {
//   development:development_env,
//   dev_ali:dev_ali_env,
//   PORT:3002,
// }[process.env.NODE_ENV || 'development']