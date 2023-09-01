<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="日期">
      <el-date-picker v-model="form.date" type="date" placeholder="请选择日期" />
    </el-form-item>
    <el-form-item label="年龄">
      <el-input-number
        v-model="form.years"
        :min="1"
        :max="100"
        controls-position="right"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { reactive, inject, nextTick } from 'vue'
import { useStore } from '../store'
import type { GridOptions } from 'ag-grid-community'
const store = useStore()
const gridOptions = inject<Ref<GridOptions>>('gridOptions')?.value || {}

const formParams = store.formParams as any
const formData = formParams.data || {}

const form = reactive({
  name: '',
  date: '',
  years: 0
})
form.name = formData.name
form.date = formData.date
form.years = formData.years

const onSubmit = () => {
  const newRowDate = gridOptions?.rowData?.map((item: any, index: number) => {
    if (index === formParams.rowIndex) {
      return { ...item, ...form }
    }
    return item
  })

  nextTick(() => {
    gridOptions.api?.setRowData(newRowDate || [])
    store.closeEditForm()
  })
}
</script>
