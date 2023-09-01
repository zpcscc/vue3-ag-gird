<template>
  <div class="operator-container">
    <div class="btn" @click="onEditor">编辑</div>
    <div class="btn" @click="onDelete">删除</div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { GridOptions } from 'ag-grid-community'
import { useStore } from '../store'
import { inject, nextTick } from 'vue'
const { params } = defineProps<{
  params: any
}>()
const store = useStore()

const gridOptions = inject<Ref<GridOptions>>('gridOptions')?.value || {}

const onEditor = () => {
  store.openEditForm(params)
}
const onDelete = () => {
  gridOptions.rowData?.splice(params.rowIndex, 1)
  nextTick(() => {
    gridOptions.api?.setRowData(gridOptions.rowData || [])
  })
}
</script>

<style>
.operator-container {
  display: flex;
}

.btn {
  margin-right: 10px;
  cursor: pointer;
}
.btn:hover {
  text-decoration: underline;
  color: rgb(250, 158, 50);
}
</style>
