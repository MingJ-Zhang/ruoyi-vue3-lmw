<script setup>
import { useTemplateRef } from 'vue'
import MobileSearch from './MobileSearch.vue'
import PageSearch from './PageSearch.vue'
import { useConfig } from '@/store/modules/layout'
defineOptions({
  components: {
    MobileSearch,
    PageSearch,
  },
})
const props = defineProps({
  useMobile: {
    type: Boolean,
    default: true,
  },
})
const pageSearchRef = useTemplateRef('pageSearchRef')
const pageSearchExpose = ref({})
const config = useConfig()
const layoutType = computed(() => {
  if (props.useMobile && config.layout.isMobile) {
    return 'MobileSearch'
  } else {
    return 'PageSearch'
  }
})
onMounted(() => {
  for (const [key, value] of Object.entries(pageSearchRef.value)) {
    pageSearchExpose.value[key] = value
  }
})
defineExpose(pageSearchExpose.value)
</script>
<template>
  <component ref="pageSearchRef" :is="layoutType">
    <template v-for="(value, slotName) in $slots" #[slotName]="{ backData }">
      <slot :name="slotName" :backData="backData"> </slot>
    </template>
  </component>
</template>

<style scoped lang="scss"></style>
