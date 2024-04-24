<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import axios from 'axios'
import { onMounted } from 'vue'
// import { useScreenOrientation } from '@vueuse/core'

// const { isSupported, orientation, angle, lockOrientation, unlockOrientation } =
//   useScreenOrientation()

// document.documentElement.requestFullscreen().then(() => screen.orientation.lock('portrait'))

onMounted(() => {
  axios.get('/menu').then((response) => {
    window.localStorage.setItem('menu', JSON.stringify(response.data))
  })
})
</script>

<style scoped></style>
