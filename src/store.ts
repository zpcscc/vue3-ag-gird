// stores/counter.js
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', {
  state: () => {
    return { dialogVisible: false, formParams: {} }
  },
  actions: {
    openEditForm(data: any) {
      this.dialogVisible = true
      this.formParams = data
    },
    closeEditForm() {
      this.dialogVisible = false
      this.formParams = {}
    }
  }
})
