<template>
  <div>
    <div class="customHeaderLabel">{{ params.displayName }}</div>
    <div @click="expandOrCollapse" :class="expandOrCollapseClass">
      <i class="fa fa-arrow-right"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const { params } = defineProps<{
  params: any
}>()


const expanded = ref(false)

const expandOrCollapseClass = computed(() => {
  return {
    'customExpandButton expanded': expanded.value,
    'customExpandButton collapsed': !expanded.value
  }
})

const expandOrCollapse = () => {
  params.setExpanded(!expanded.value)
}

const onExpandChanged = () => {
  console.log(params)
  expanded.value = params.columnGroup?.getProvidedColumnGroup()?.isExpanded()
}

onMounted(() => {
  params.columnGroup
    ?.getProvidedColumnGroup()
    .addEventListener('expandedChanged', onExpandChanged.bind(this))
})
</script>

<style>
.customHeaderLabel {
  margin-left: 5px;
  margin-top: 3px;
  float: left;
}

.customExpandButton {
  float: right;
  margin-top: 5px;
  margin-left: 3px;
}

.expanded {
  animation-name: toExpanded;
  animation-duration: 1s;
  -webkit-transform: rotate(180deg); /* Chrome, Safari, Opera */
  transform: rotate(180deg);
}

.collapsed {
  color: cornflowerblue;
  animation-name: toCollapsed;
  animation-duration: 1s;
  -webkit-transform: rotate(0deg); /* Chrome, Safari, Opera */
  transform: rotate(0deg);
}

@keyframes toExpanded {
  from {
    color: cornflowerblue;
    -webkit-transform: rotate(0deg); /* Chrome, Safari, Opera */
    transform: rotate(0deg);
  }
  to {
    color: black;
    -webkit-transform: rotate(180deg); /* Chrome, Safari, Opera */
    transform: rotate(180deg);
  }
}

@keyframes toCollapsed {
  from {
    color: black;
    -webkit-transform: rotate(180deg); /* Chrome, Safari, Opera */
    transform: rotate(180deg);
  }
  to {
    color: cornflowerblue;
    -webkit-transform: rotate(0deg); /* Chrome, Safari, Opera */
    transform: rotate(0deg);
  }
}
</style>
