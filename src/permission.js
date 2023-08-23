import router from '@/router'
import {useProfile} from '@/store/profile.js'
const profile = useProfile()
/**
 * 处理需登录页面的访问权限
 */
router.beforeEach((to, from) => {
  // 无需登录的页面访问
  if (!to.meta.user) {
    return
  }
  // 已登录，可进入
  if (profile.token) {
    return true
  }

  // 未登录，警告然后返回首页
  message('warn', '登录失效，请重新登录!')
  return '/'
})
