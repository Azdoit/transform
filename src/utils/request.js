import axios from 'axios'

const service = axios.create({
  baseURL: 'import.meta.env.VITE_BASE_API',
  timeout: 1000 * 20 // 请求超时时间
  // withCredentials: false // 由于后端 CORS 设置，要和后端一致，这里设置 false
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('error: ', error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 根据权限异常，处理对应逻辑
    if (error.response && error.response.data && error.response.data.Code) {
      console.log(error.response)
      if (error.response.data.Code === 401) {
        window.location.href = '/'
      } else if (error.response.data.Code === 403) {
        ElMessage({
          message: '您当前权限有限，如需查看请联系管理员！',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      console.error('err: ', error) // for debug
      error.message &&
        ElMessage({
          message: '网络错误',
          type: 'error',
          duration: 5 * 1000
        })
    }
    // return Promise.reject(error)
    return { error: true }
  }
)

export default service
