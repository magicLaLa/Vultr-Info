// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 获取 当前 用户 vultr 配置
const { apiKey, serverSubId } = require('./config')

// 云函数入口函数
exports.main = async (event, context) => {
  const getAccountInfo = await axios({
    url: 'https://api.vultr.com/v1/account/info',
    method: 'get',
    headers: {
      "API-key": apiKey
    }
  }).then((res) => {
    return res.data
  })
  const getApiInfo = await axios({
    url: 'https://api.vultr.com/v1/auth/info',
    method: 'get',
    headers: {
      "API-key": apiKey
    }
  }).then((res) => {
    return res.data
  })
  const getServerInfo = await axios({
    url: 'https://api.vultr.com/v1/server/list',
    method: 'get',
    headers: {
      "API-key": apiKey
    }
  }).then((res) => {
    let data = res.data
    let serverGeneralInfo = data[serverSubId]
    return serverGeneralInfo
  })
  
  return {
    ...getAccountInfo,
    ...getApiInfo,
    ...getServerInfo
  }
}