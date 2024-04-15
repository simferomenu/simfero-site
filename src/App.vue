<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';

onMounted(() => {
  axios.get('/menu').then((response) => {
    window.localStorage.setItem('menu', JSON.stringify(response.data));
  });
})
</script>

<style scoped></style>

