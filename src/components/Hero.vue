<script setup>
import Scroll from "@/assets/scroll.svg"
</script>

<template>
  <section id="hero" class="w-screen h-screen text-gray-600 dark:text-white flex flex-col justify-center items-center gap-4 bg-orange-200 dark:bg-gray-600">
    <h2 class="text-3xl md:text-4xl font-bold">HI, I'M RIFKI</h2>
    <h1 class="text-7xl md:text-8xl font-bold">I BUILD</h1>
    <h2 class="text-2xl md:text-3xl font-bold">DIGITAL SOLUTIONS</h2>

    <p class="text-lg md:text-xl mt-4 text-center max-w-xl">
      Exploring technology and creativity to bring innovative ideas to life. Welcome to my portfolio!
    </p>

    <div class="absolute bottom-5 flex flex-col gap-3 p-4 items-center justify-end text-sm animate-pulse">
      <p>Scroll to Explore</p>
      <Scroll class="dark:fill-white size-5 animate-bounce" />
    </div>
  </section>
</template>
