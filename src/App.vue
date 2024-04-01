<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>
