<script setup>
import { onMounted } from "vue";
import WelcomeManagement from "./components/WelcomeManagement.vue";
import BookingOverview from "./components/BookingOverview.vue";

onMounted(() => {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/login.html";
  }
});
</script>

<template>
  <main class="px-2 pt-20 md:px-7 md:pt-8 lg:px-40 lg:pt-19">
    <WelcomeManagement />
    <BookingOverview />
  </main>
</template>
