<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen relative">
    <Header />
    <router-view class="grow" />
    <Footer class="shrink-0"/>
  </div>
</template>

<style scoped></style>
