<template>
  <div class="toast" :class="{ show: store.toastShow }">{{ store.toastMsg }}</div>
</template>

<script setup>
import { store } from '../store.js'
</script>
