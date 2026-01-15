import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 表单相关API
export const formApi = {
  // 获取表单列表
  getFormList: (params) => api.get('/form/list', { params }),
  
  // 获取表单详情
  getFormDetail: (id) => api.get(`/form/detail/${id}`),
  
  // 审核表单
  approveForm: (data) => api.post('/form/approve', data),
  
  // 获取表单统计
  getFormStats: () => api.get('/form/stats')
}

// 配置相关API
export const configApi = {
  // 获取邮件配置
  getEmailConfig: () => api.get('/config/email'),
  
  // 更新邮件配置
  updateEmailConfig: (data) => api.post('/config/email', data)
}

export default api
