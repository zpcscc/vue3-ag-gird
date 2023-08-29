<template>
  <div class="filter">
    <span class="reset" @click="onResetDate()">x</span>
    <input
      class="dd"
      @change="onDateChanged('dd', $event)"
      placeholder="dd"
      v-model="dd"
      maxLength="2"
    />/
    <input
      class="mm"
      @change="onDateChanged('mm', $event)"
      placeholder="mm"
      v-model="mm"
      maxLength="2"
    />/
    <input
      class="yyyy"
      @change="onDateChanged('yyyy', $event)"
      placeholder="yyyy"
      v-model="yyyy"
      maxLength="4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

const { params } = defineProps<{
  params: any
}>()

const date: Ref<Date | null> = ref(null)
const dd = ref('')
const mm = ref('')
const yyyy = ref('')

const onResetDate = () => {
  date.value = null
  dd.value = ''
  mm.value = ''
  yyyy.value = ''
  params.onDateChanged()
}

const parseDate = (dd: string, mm: string, yyyy: string) => {
  if (dd.trim() === '' || mm.trim() === '' || yyyy.trim() === '') {
    return null
  }

  let day = Number(dd)
  let month = Number(mm)
  let year = Number(yyyy)

  let date = new Date(year, month - 1, day)

  //If the date is not valid
  if (isNaN(date.getTime())) {
    return null
  }

  if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
    return null
  }
  return date
}

const onDateChanged = (on: any, $event: any) => {
  let targetValue = $event.target.value
  date.value = parseDate(
    on === 'dd' ? targetValue : dd,
    on === 'mm' ? targetValue : mm,
    on === 'yyyy' ? targetValue : yyyy
  )
  params.onDateChanged()
}
</script>

<style>
.filter {
  margin: 2px;
}

.dd {
  width: 30px;
}

.mm {
  width: 30px;
}

.yyyy {
  width: 60px;
}

.reset {
  padding: 2px;
  background-color: red;
  border-radius: 3px;
  font-size: 10px;
  margin-right: 5px;
  color: white;
}
</style>
