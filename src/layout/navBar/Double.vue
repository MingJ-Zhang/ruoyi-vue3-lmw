<template>
  <div class="layouts-menu-horizontal-double">
    <el-scrollbar
      ref="horizontalMenusRef"
      class="double-menus-scrollbar"
      always
    >
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        @select="handleSelect"
        :ellipsis="false"
      >
        <template v-for="(item, index) in topMenus">
          <el-menu-item
            :index="item.path"
            :key="index"
            v-if="index < visibleNumber"
          >
            <svg-icon
              v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
              :icon-class="item.meta.icon"
            />
            <span class="ml5">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>

        <!-- 顶部菜单超出数量折叠 -->
        <el-sub-menu index="more" v-if="topMenus.length > visibleNumber">
          <template #title>更多菜单</template>
          <template v-for="(item, index) in topMenus">
            <el-menu-item
              :index="item.path"
              :key="index"
              v-if="index >= visibleNumber"
            >
              <svg-icon :icon-class="item.meta.icon" />
              <span class="ml5">{{ item.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
    <NavMenus />
  </div>
</template>

<script setup>
import NavMenus from './NavMenus.vue'
import { constantRoutes } from '@/router'
import { isHttp } from '@/utils/validate'
import usePermissionStore from '@/store/modules/permission'
import { useConfig } from '@/store/modules/layout'

const config = useConfig()
const horizontalMenusRef = ref(null)
// 顶部栏初始数
const visibleNumber = ref(null)
// 当前激活菜单的 index
const currentIndex = ref(null)
// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile']

const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters)

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = []
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === '/') {
        topMenus.push(menu.children[0])
      } else {
        topMenus.push(menu)
      }
    }
  })
  return topMenus
})

// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = []
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (router.path === '/') {
          router.children[item].path = '/' + router.children[item].path
        } else {
          if (!isHttp(router.children[item].path)) {
            router.children[item].path =
              router.path + '/' + router.children[item].path
          }
        }
        router.children[item].parentPath = router.path
      }
      childrenMenus.push(router.children[item])
    }
  })
  return constantRoutes.concat(childrenMenus)
})

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  let activePath = path
  if (
    path !== undefined &&
    path.lastIndexOf('/') > 0 &&
    hideList.indexOf(path) === -1
  ) {
    const tmpPath = path.substring(1, path.length)
    activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'))
    if (!route.meta.link) {
    }
  } else if (!route.children) {
    activePath = path
  }
  activeRoutes(activePath)
  return activePath
})

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3
  visibleNumber.value = parseInt(width / 85)
}

function handleSelect(key, keyPath) {
  currentIndex.value = key
  const route = routers.value.find((item) => item.path === key)
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, '_blank')
  } else if (!route || !route.children) {
    // 没有子路由路径内部打开
    const routeMenu = childrenMenus.value.find((item) => item.path === key)
    if (routeMenu && routeMenu.query) {
      let query = JSON.parse(routeMenu.query)
      router.push({ path: key, query: query })
    } else {
      router.push({ path: key })
    }
  } else {
    // 显示左侧联动菜单
    activeRoutes(key)
  }
}

function activeRoutes(key) {
  let routes = []
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == 'index' && '' == item.path)) {
        routes.push(item)
      }
    })
  }
  if (routes.length > 0) {
    permissionStore.setSidebarRouters(routes)
  } else {
  }
  return routes
}

// 滚动条滚动到激活菜单所在位置
const verticalMenusScroll = () => {
  nextTick(() => {
    let activeMenu = document.querySelector(
      '.el-menu.menu-horizontal li.is-active'
    )
    if (!activeMenu) return false
    horizontalMenusRef.value?.setScrollTop(activeMenu.offsetTop)
  })
}

onMounted(() => {
  verticalMenusScroll()
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})

onMounted(() => {
  setVisibleNumber()
})
</script>

<style scoped lang="scss">
.layouts-menu-horizontal-double {
  display: flex;
  align-items: center;
  height: 60px;
  background-color: var(--ba-bg-color-overlay);
  border-bottom: solid 1px var(--el-color-info-light-8);
}
.double-menus-scrollbar {
  width: 70vw;
  :deep(.is-vertical) {
    height: 0;
    display: none;
  }
}
.menu-horizontal {
  border: none;
  --el-menu-bg-color: v-bind('config.getColorVal("menuBackground")');
  --el-menu-text-color: v-bind('config.getColorVal("menuColor")');
  --el-menu-active-color: v-bind('config.getColorVal("menuActiveColor")');
  --el-menu-hover-bg-color: v-bind('config.getColorVal("menuHoverBackground")');
}

.el-sub-menu .icon,
.el-menu-item .icon {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.is-active .icon {
  color: var(--el-menu-active-color) !important;
}
.el-menu-item.is-active {
  background-color: v-bind('config.getColorVal("menuActiveBackground")');
}
</style>
