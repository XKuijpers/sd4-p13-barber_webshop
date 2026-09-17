<template>
  <div class="mx-auto max-w-150">
    <p class="h1 text-center">Barbershop Name</p>

    <p class="text-highlight h2 pt-2 text-center">
      Administrative Dashboard Login
    </p>

    <div class="primary-bg border-highlight mt-10 rounded-lg border-4 p-8">
      <div class="flex flex-col gap-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="border-accent border-b-4 bg-transparent px-2 py-2 outline-none"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="border-accent border-b-4 bg-transparent px-2 py-2 outline-none"
          @keyup.enter="login"
        />

        <p v-if="errorMessage" class="text-center text-red-900">
          {{ errorMessage }}
        </p>

        <div
          @click="login"
          class="border-highlight h4 highlight-button mx-auto mt-8 w-fit rounded-lg border-4 px-6 py-2 text-center hover:cursor-pointer hover:text-white"
        >
          Login
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const API_URL = "https://sd4-p13-barber-webshop.vercel.app";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

async function login() {
  errorMessage.value = "";

  if (!username.value || !password.value) {
    errorMessage.value = "Please enter your username and password.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message;
      return;
    }

    sessionStorage.setItem("isLoggedIn", "true");
    window.location.href = "/management.html";
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value = "Something went wrong. Please try again.";
  }
}
</script>
