<script setup>
import { computed } from 'vue'
import DictCpn from './dictCpn.vue'
const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  dictMap: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const infoConfig = computed(() => {
  return props.config.filter((item) => {
    return item.prop !== 'todo' && item.mobileSlot !== 'footer'
  })
})
const modelValue = defineModel('modelValue')
</script>
<template>
  <el-dialog title="详情" v-model="modelValue" fullscreen>
    <div>
      <div class="infoItem" v-for="item in infoConfig">
        <span class="infoLabel">{{ item.label }}：</span>
        <span class="infoValue">
          <template v-if="item.isDict">
            <DictCpn
              :value="row[item.prop]"
              :options="dictMap[item.prop]"
            ></DictCpn>
          </template>
          <template v-else>
            <slot :name="item.slotName" :backData="row">
              <span class="value">{{ row[item.prop] }}</span>
            </slot>
          </template>
        </span>
      </div>
    </div>

    <template #footer>
      <el-button @click="modelValue = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.infoLabel {
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 500;
}
.infoValue {
  font-size: 16px;
}
.infoItem {
  line-height: 40px;
  display: flex;
  flex-wrap: wrap;
}
</style>
