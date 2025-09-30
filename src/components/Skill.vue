<script setup>
import Frontend from "@/assets/frontend.svg";
import Backend from "@/assets/backend.svg";
import Database from "@/assets/database.svg";
import DevOps from "@/assets/devops.svg";
import ProgrammingLanguage from "@/assets/planguage.svg";
import Tool from "@/assets/tool.svg";
import Language from "@/assets/language.svg";

const icons = {
  Frontend,
  Backend,
  Database,
  DevOps,
  ProgrammingLanguage,
  Tool,
  Language,
};

const skills = [
  {
    name: "Frontend",
    items: ["Vue", "Nuxt", "TailwindCSS", "Odoo"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Express", "Laravel", "FastAPI", "Odoo"],
  },
  {
    name: "Database",
    items: ["MySQL", "PostgreSQL", "Redis", "Alibaba Cloud"],
  },
  {
    name: "DevOps",
    items: ["Docker"],
  },
  {
    name: "ProgrammingLanguage",
    items: ["JavaScript", "TypeScript", "Python", "PHP"],
  },
  {
    name: "Tool",
    items: ["Jest", "PHPUnit", "Pytest", "REST API"],
  },
  {
    name: "Language",
    items: ["Bahasa Indonesia"],
  },
];
</script>

<template>
  <section id="skills" class="w-screen min-h-screen md:px-80 px-8 py-8 flex flex-col justify-center gap-4 text-gray-600 bg-orange-50 dark:bg-gray-600">
    <h1 class="py-4 text-lg font-bold text-center underline dark:text-white">SKILLS</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:py-8">
      <div v-for="skill in skills" :key="skill.name" class="shadow rounded-xl p-4 bg-orange-200 dark:bg-gray-500 dark:text-white">
        <div class="flex gap-2 items-center pb-4">
          <component :is="icons[skill.name]" class="size-6 dark:fill-white" 
                     :class="{ 'dark:stroke-white': skill.name == 'Backend' || skill.name == 'Tool' }" />
          <h1 class="font-bold text-xl">{{ skill.name }}</h1>
        </div>
        <ul class="flex flex-wrap gap-4">
          <li v-for="(item, index) in skill.items" :key="index" 
              class="shadow text-xs md:text-sm font-bold text-gray-600 bg-orange-100 dark:bg-white rounded-full w-fit py-1 px-2">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
