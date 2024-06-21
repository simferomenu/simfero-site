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
  });

  setInterval(() => {
    if (window.localStorage.selectedTables) {
      try {
        const table = JSON.parse(window.localStorage.getItem('selectedTables'));

        axios.get(`/table/check/${table}`).then((response) => {
          console.log('Order data: ', response.data);
        });
      } catch (error) {
        console.log('Ошибка обнвдения данных заказа...', error);
      }
    }
  }, 5000);
})
</script>

<style scoped></style>
