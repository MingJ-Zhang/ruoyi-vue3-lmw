import { useDark, useToggle } from '@vueuse/core'
import { useConfig } from '@/store/modules/layout'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const isDark = useDark({
  onChanged(dark) {
    nextTick(() => {
      const config = useConfig()
      updateHtmlDarkClass(dark)
      config.setLayout('isDark', dark)
      config.onSetLayoutColor()
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      metaThemeColor.content = dark ? '#1d1e1f' : '#ffffff'
    })
  },
})

/**
 * 切换暗黑模式
 */
const toggleDark = useToggle(isDark)

/**
 * 切换当前页面的暗黑模式
 */
export function togglePageDark(val) {
  const config = useConfig()
  const isDark = ref(config.layout.isDark)
  onMounted(() => {
    if (isDark.value !== val) updateHtmlDarkClass(val)
  })
  onUnmounted(() => {
    updateHtmlDarkClass(isDark.value)
  })
  watch(
    () => config.layout.isDark,
    (newVal) => {
      isDark.value = newVal
      if (isDark.value !== val) updateHtmlDarkClass(val)
    }
  )
}

export function updateHtmlDarkClass(val) {
  const htmlEl = document.getElementsByTagName('html')[0]
  if (val) {
    htmlEl.setAttribute('class', 'dark')
  } else {
    htmlEl.setAttribute('class', '')
  }
}
// 根据系统变化主题
export function toggleDarkBySystem() {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const matches = darkModeQuery.matches
  toggleDark(matches)
  updateHtmlDarkClass(matches)
  toggleDark(darkModeQuery.matches)
  darkModeQuery.addEventListener('change', (event) => {
    toggleDark(event.matches)
    updateHtmlDarkClass(event.matches)
  })
}

export default toggleDark
