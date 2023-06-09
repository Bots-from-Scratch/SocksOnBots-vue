<script lang="ts">
import {defineComponent} from "vue";
import HeroBanner from "@/components/HeroBanner.vue";
import PixelCard from "@/components/PixelCard.vue";

export default defineComponent({
  components: {PixelCard, HeroBanner}
})
</script>

<template>
  <div>
    <HeroBanner />
    <div class="container mx-auto flex justify-center gap-20 my-32 flex-wrap">
    <PixelCard text="text"/>
    <PixelCard />
    <PixelCard />
    </div>
  </div>
</template>

<style scoped></style>
