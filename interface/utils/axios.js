import axios from 'axios'
// 创建了一个 axios 的实例
const instance = axios.create({
  baseURL:`http://${process.env.HOST || 'localhost'}:${precess.env.PORT||3000}`,
  timeout:1000,
  headers:{

  }
})
export default instance