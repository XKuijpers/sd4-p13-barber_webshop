<template>
  <footer class="px-2 pt-16 pb-10 md:px-7 md:pt-30 lg:px-40 lg:pt-55">
    <div class="flex flex-col gap-y-4 md:flex-row md:gap-x-30 md:gap-y-0">
      <img src="../assets/barber_webshop.png" alt="" class="w-full md:h-fit md:w-[256px]">

      <div
        class="ml-auto flex gap-30 md:flex-col md:gap-8 lg:flex-row lg:gap-32"
      >
        <div class="ml-auto flex flex-col gap-y-2">
          <p class="h2 text-highlight">Contact</p>
          <p class="text hover:cursor-pointer">
            <a href="mailto:lorem@ipsum">lorem@ipsum</a>
          </p>
          <p class="text hover:cursor-pointer">
            <a href="tel:+31627055989">+31 6 27055989</a>
          </p>
        </div>

        <div class="h2 flex flex-col gap-y-2">
          <p class="text-highlight">Follow</p>
          <div class="-ml-1 flex flex-row gap-1">
            <i class="fa-brands fa-instagram hover:cursor-pointer"></i>
            <i class="fa-brands fa-linkedin hover:cursor-pointer"></i>
            <i class="fa-brands fa-square-facebook hover:cursor-pointer"></i>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
</script>
