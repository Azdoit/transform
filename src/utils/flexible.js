/**
 * 首次加载成功时设置html跟标签的fontSize属性值；最大基准值为40px
 */
export const useREM = () => {
  // 设置font-size的最大值为40px
  const MAX_FONT_SIZE = 40
  // 当文档被解析成功时调用
  window.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    // 设置屏幕基准值的标准为 屏幕的宽度 / 10
    const fontSize = window.innerWidth / 10
    html.style.fontSize = Math.min(fontSize, MAX_FONT_SIZE) + 'px'
  })
}
