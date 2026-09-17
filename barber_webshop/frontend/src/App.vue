<script setup>
import Header from "./components/Header.vue";
import Welcome from "./components/Welcome.vue";
import Services from "./components/Services.vue";
import Gallery from "./components/Gallery.vue";
import Booking from "./components/Booking.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <a href="#bookAppointment">
    <Header />
  </a>

  <main class="px-2 pt-20 md:px-7 md:pt-8 lg:px-40 lg:pt-19">
    <Welcome />
    <Services />
    <Gallery />
    <div id="bookAppointment">
      <Booking />
    </div>
  </main>

  <Footer />
</template>
