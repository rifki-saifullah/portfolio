<script setup>
import { ref, onMounted } from "vue";
import Menu from "@/assets/menu.svg";
import Cancel from "@/assets/cancel.svg";
import Sun from "@/assets/sun.svg";
import Moon from "@/assets/moon.svg";

const isOpen = ref(false);

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};

const lightMode = ref("light");

const applyTheme = (light) => {
  const root = document.documentElement;
  if (light) {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
};

const changeLightMode = (mode) => {
  lightMode.value = mode;
  localStorage.setItem("theme", mode);
  applyTheme(lightMode.value === "light");
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    lightMode.value = "light";
  } else if (savedTheme === "dark") {
    lightMode.value = "dark";
  } else {
    lightMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(lightMode.value === "light");
});
</script>

<template>
  <header class="fixed w-screen top-0 left-0 z-10">
    <div class="mx-4 my-4 px-6 py-4 flex justify-between items-center rounded shadow bg-white dark:bg-white blur-none z-10">
      <h1 class="font-bold text-gray-600">Portofolio</h1>

      <nav class="hidden sm:inline gap-8 text-sm">
        <ul class="flex gap-8 text-sm text-gray-600">
          <Sun v-if="lightMode == 'light'" @click="changeLightMode('dark')" class="size-5 cursor-pointer" />
          <Moon v-if="lightMode == 'dark'" @click="changeLightMode('light')" class="size-5 cursor-pointer" />
  <!-- Desktop nav -->
  <li><a href="#about" class="hover:text-gray-800 hover:underline transition">About</a></li>
  <li><a href="#skills" class="hover:text-gray-800 hover:underline transition">Skills</a></li>
  <li><a href="#projects" class="hover:text-gray-800 hover:underline transition">Projects</a></li>
  <li><a href="#contact" class="hover:text-gray-800 hover:underline transition">Contact</a></li>
        </ul>
      </nav>

      <div class="flex gap-5 sm:hidden" v-if="!isOpen">
        <Sun v-if="lightMode == 'light'" @click="changeLightMode('dark')" class="size-5 cursor-pointer" />
        <Moon v-if="lightMode == 'dark'" @click="changeLightMode('light')" class="size-5 cursor-pointer" />
        <Menu @click="toggleNav" class="z-10 sm:hidden cursor-pointer size-5" />
      </div>

      <Cancel v-if="isOpen" @click="toggleNav" class="z-10 sm:hidden cursor-pointer size-4 stroke-gray-600 dark:stroke-white" />

      <!-- Mobile nav with transition -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <nav
          v-if="isOpen"
          class="w-screen h-screen absolute inset-0 flex justify-center items-center sm:hidden bg-white dark:bg-gray-600 text-gray-600 dark:text-white"
        >
<ul class="flex flex-col text-sm text-center space-y-8">
  <li><a href="#about" @click="toggleNav" class="hover:text-gray-800 hover:underline transition">ABOUT</a></li>
  <li><a href="#skills" @click="toggleNav" class="hover:text-gray-800 hover:underline transition">SKILLS</a></li>
  <li><a href="#projects" @click="toggleNav" class="hover:text-gray-800 hover:underline transition">PROJECTS</a></li>
  <li><a href="#contact" @click="toggleNav" class="hover:text-gray-800 hover:underline transition">CONTACTS</a></li>
</ul>
        </nav>
      </Transition>
    </div>
  </header>
</template>
