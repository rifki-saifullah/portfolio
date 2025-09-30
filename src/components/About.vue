<script setup>
import Linkedin from "@/assets/linkedin.svg";
import Github from "@/assets/github.svg";
import Chess from "@/assets/chess.svg";
</script>

<template>
  <section id="about" class="w-screen min-h-screen py-2 md:px-80 px-8 flex flex-col justify-center gap-4 text-gray-600 dark:text-white bg-orange-50 dark:bg-gray-500">
    <h3 class="text-sm font-bold text-center underline">ABOUT ME</h3>
    
    <div class="flex flex-col items-center gap-4">
      <h1 class="font-bold text-4xl text-shadow-md text-shadow-orange-200 dark:text-shadow-none text-gray-600 dark:text-white">RIFKI SAIFULLAH</h1>
      <h2 class="w-fit py-2 px-3 rounded-full text-sm bg-orange-200 dark:bg-white dark:text-gray-600 font-bold">
        Junior Web & Odoo Developer
      </h2>
    </div>

    <p class="text-justify py-4 leading-8 first-letter:text-2xl first-letter:pl-8">
      I am a passionate junior web developer and junior Odoo developer, currently expanding my skills in Odoo development. 
      I enjoy creating efficient, user-friendly digital solutions and continuously learning new technologies to build innovative applications.
    </p>

    <a href="" class="hidden items-end w-fit text-sm font-bold px-3 py-2 rounded bg-gray-200 dark:bg-orange-50 dark:hover:bg-white dark:text-gray-600 dark:hover:text-gray-700 hover:bg-gray-600 hover:text-white transition shadow">
      Download CV
    </a>

    <div class="flex justify-between">
      <a href="" class="hidden items-end w-fit text-sm font-bold px-3 py-2 rounded bg-gray-200 dark:bg-orange-50 dark:hover:bg-white dark:text-gray-600 dark:hover:text-gray-700 hover:bg-gray-600 hover:text-white transition shadow">
        Download CV
      </a>

      <div class="flex items-center gap-4">
        <p>Connect with me :</p>
<a href="https://www.linkedin.com/in/rifki-saifullah-550483343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-orange-200 hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-orange-50 dark:hover:bg-white">
  <Linkedin class="size-5" />
</a>

<a href="https://github.com/rifki-saifullah" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-orange-200 hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-orange-50 dark:hover:bg-white">
  <Github class="size-5" />
</a>

<a href="https://www.chess.com/member/Santuyinaja" 
   target="_blank" rel="noopener noreferrer" 
   class="w-fit p-2 rounded-full bg-orange-200 hover:bg-orange-300 hover:scale-110 transition shadow dark:bg-orange-50 dark:hover:bg-white">
  <Chess class="size-5" />
</a>

      </div>
    </div>
  </section>
</template>
