<script setup>
import novelImg from '@/assets/novel-app.png'
import umkmImg from '@/assets/umkm.png'
import inventoryImg from '@/assets/inventory-app.png'
import blogImg from '@/assets/blog.png'
import companyImg from '@/assets/jwd.png'

const projects = [
  {
    name: "Novel App",
    desc: "A novel reading app with prohibited content detection using Artificial Neural Networks (ANN) and modern web technologies.",
    img: novelImg,
    tech: ["Vue","FastAPI","Python","Pytest","Javascript","Redis","PostgreSQL","Alembic","SQLAlchemy","ANN"],
    code: "https://github.com/rifki-saifullah/novel-app",
  },
  {
    name: "UMKM Website",
    desc: "A small business website built with Nuxt.js and TailwindCSS, optimized for SEO and responsive design.",
    img: umkmImg,
    tech: ["TypeScript","Nuxt JS","TailwindCSS","SEO"],
    demo: "https://cemilan-dan-snack-mamah-ntin.vercel.app"
  },
  {
    name: "Inventory App",
    desc: "A simple inventory management application with REST API integration, testing, and Docker deployment.",
    img: inventoryImg,
    tech: ["TypeScript","Nuxt JS","Nuxt UI","TailwindCSS","Node.js","Express","MySQL","Jest","REST API","Docker"],
    code: "https://github.com/rifki-saifullah/inventory-app",
  },
  {
    name: "Personal Blog",
    desc: "A blog platform built with Laravel and Inertia Vue, including automated testing and responsive UI.",
    img: blogImg,
    tech: ["Laravel","Inertia Vue","PHPUnit","TailwindCSS","MySQL"],
    code: "https://github.com/rifki-saifullah/blog",
  },
  {
    name: "Company Profile",
    desc: "A corporate website showcasing company information, services, and team members using modern web frameworks.",
    img: companyImg,
    tech: ["Vue","FastAPI","Python","Pytest","Javascript","PostgreSQL","Alembic","SQLAlchemy"],
    code: "https://github.com/rifki-saifullah/next-innovation-studio",
  }
];
</script>

<template>
<section id="projects" class="w-screen min-h-screen md:px-36 px-8 py-8 flex flex-col justify-center gap-4 text-gray-600 dark:text-white bg-orange-50 dark:bg-gray-500">
  <h1 class="py-4 text-lg font-bold text-center underline">Projects</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:py-8">
    <div v-for="project in projects" :key="project.name" class="flex flex-col shadow rounded bg-orange-200 dark:bg-gray-600 dark:text-white overflow-hidden">
      <img class="w-full h-72 object-cover" :src="project.img" />
      <div class="flex flex-col flex-1 justify-between gap-2 overflow-hidden p-8">
        <div>
          <h1 class="text-2xl font-bold">{{ project.name }}</h1>
          <p class="leading-8">{{ project.desc }}</p>
        </div>
        <ul class="flex flex-wrap gap-4 text-white text-sm py-2">
          <li v-for="item in project.tech" :key="item" class="text-xs md:text-sm font-bold text-gray-600 bg-orange-100 dark:bg-white rounded-full w-fit py-1 px-2">{{ item }}</li>
        </ul>
        <div class="dark:text-gray-600 flex gap-4 items-end justify-end">
          <a 
            v-if="project.code"
            :href="project.code" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="items-end w-fit text-sm font-bold px-3 py-2 rounded bg-orange-50 hover:bg-white hover:text-gray-700 transition shadow"
          >View Code</a>
          <span v-else class="items-end w-fit text-sm font-bold px-3 py-2 rounded bg-gray-300 text-gray-500 cursor-not-allowed">No Code</span>

          <a 
            v-if="project.demo"
            :href="project.demo" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="items-end w-fit text-sm font-bold px-3 py-2 rounded bg-orange-50 hover:bg-white hover:text-gray-700 transition shadow"
          >View Demo</a>
          <span v-else class="items-end w-fit text-sm font-bold px-3 py-2 rounded bg-gray-300 text-gray-500 cursor-not-allowed">No Demo</span>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
