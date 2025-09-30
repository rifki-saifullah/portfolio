<script setup>
import Email from "@/assets/email.svg";
import Location from "@/assets/location.svg";
import Linkedin from "@/assets/linkedin.svg";
import Github from "@/assets/github.svg";
import Chess from "@/assets/chess.svg";
</script>

<template>
  <section id="contact" class="w-screen relative h-60 bg-gray-600 dark:bg-gray-700 mb-40 md:mb-50 shadow">
    <div class="absolute top-20 left-0 right-0 bg-orange-200 dark:bg-gray-600 text-gray-600 dark:text-white w-full md:w-1/2 m-auto p-8 flex flex-col gap-4 rounded-b-2xl md:rounded-2xl">
      <h1 class="font-bold text-lg">Informasi Kontak</h1>

      <div class="flex gap-4 items-center">
        <Email class="size-5 dark:fill-white" />
        <div>
          <p class="font-bold">Email</p>
          <p class="text-sm md:text-md">rifki.saifullah.professional@proton.me</p>
        </div>
      </div>

      <div class="flex gap-4 items-center">
        <Location class="size-5 dark:fill-white" />
        <div>
          <p class="font-bold">Lokasi</p>
          <p class="text-sm md:text-md">Kuningan, Jawa Barat.</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <p class="text-sm">Connect with me :</p>
<a href="https://www.linkedin.com/in/rifki-saifullah-550483343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-white hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-white dark:hover:bg-orange-50">
  <Linkedin class="size-5" />
</a>

<a href="https://github.com/rifki-saifullah" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-white hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-white dark:hover:bg-orange-50">
  <Github class="size-5" />
</a>

<a href="https://www.chess.com/member/Santuyinaja" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-white hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-white dark:hover:bg-orange-50">
  <Chess class="size-5" />
</a>


      </div>

    </div>
  </section>
</template>
