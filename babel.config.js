//是否是生产环境的判断
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
}
