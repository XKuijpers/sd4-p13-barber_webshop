<template>
  <div id="bookingSection" class="pt-16 pb-10 md:pt-30 lg:pt-55">
    <p class="h1 text-center">Book Appointment</p>

    <div class="h2 flex flex-row items-center justify-center gap-3 pt-12">
      <i
        class="fa-solid fa-arrow-left text-highlight hover:cursor-pointer hover:!text-black"
        @click="previousMonth"
      ></i>
      <p class="items-center">{{ monthName }} {{ currentYear }}</p>
      <i
        class="fa-solid fa-arrow-right text-highlight hover:cursor-pointer hover:!text-black"
        @click="nextMonth"
      ></i>
    </div>

    <div class="grid grid-cols-5 gap-6 pt-6 text-center md:grid-cols-7">
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="h1 highlight-button col-span-1 flex aspect-square items-center justify-center hover:cursor-pointer hover:text-white"
        :class="getDayColor(day)"
        @click="openPopup(day)"
      >
        {{ day }}
      </div>
    </div>

    <div
      v-if="showPopup"
      class="fixed inset-0 grid grid-cols-12 items-center justify-center"
    >
      <div class="primary-bg border-highlight col-span-8 col-start-3 border-4">
        <div class="flex flex-row px-6 py-4">
          <p class="h2 ml-auto w-fit text-center">
            {{ selectedMonth }} {{ selectedDay }} {{ selectedYear }}
          </p>

          <p
            class="text-highlight h3 ml-auto w-fit hover:cursor-pointer"
            @click="closePopup"
          >
            X
          </p>
        </div>

        <div class="flex flex-row px-8 py-4">
          <div
            v-if="!clickedTime"
            class="grid grid-cols-4 gap-x-15 gap-y-2 md:gap-y-6 lg:gap-x-12"
          >
            <div
                v-for="time in timeSlots"
                :key="time"
                class="group highlight-button primary-bg border-highlight col-span-full border-4 px-5 py-1 hover:cursor-pointer md:col-span-2 lg:px-8"
                :class="{ 'full-color': isBooked(time) }"
                @click="timeSelected(time)"
            >
              <p class="h4 group-hover:text-white">
                {{ time }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="clickedTime" class="ml-auto w-fit flex-col gap-y-3">
          <div class="flex flex-row">
            <div class="flex flex-col gap-y-3">
              <div
                  v-for="service in selectedAppointment.services.split(',')"
                  :key="service"
                  class="h2 grid grid-cols-6 items-center"
              >
                <div class="accent mx-auto w-8 rounded-full">
                  <div class="h4 col-span-1 text-center">
                    1
                  </div>
                </div>

                <div class="h4 col-span-3 mr-auto pl-2">
                  {{ service }}
                </div>
              </div>

              <div class="flex flex-row mt-4">
                <p class="h4">
                  Phone:
                </p>
                <p class="text-text ml-2 my-auto font-bold">
                  {{ selectedAppointment.customer_phone }}
                </p>
              </div>


              <div class="flex flex-row mb-4">
                <p class="h4">
                  Email:
                </p>
                <p class="text-text ml-2 my-auto font-bold mr-6">
                  {{ selectedAppointment.customer_email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

let clickedTime = ref(false);

const currentMonth = ref(0);
const currentYear = ref(2026);

const showPopup = ref(false);

const selectedDay = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);

const appointments = ref([]);
const selectedAppointment = ref(null);

const monthAppointments = ref([]);

const timeSlots = [
  "08:00 - 08:45",
  "08:45 - 09:30",
  "09:30 - 10:15",
  "10:15 - 11:00",
  "11:00 - 11:45",
  "11:45 - 12:30",
  "12:30 - 13:15",
  "13:15 - 14:00",
  "14:00 - 14:45",
  "14:45 - 15:30",
];

const serviceList = ref([
  {
    name: "Haircut",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    name: "Beard Trim",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    name: "Cleanshave",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    name: "Hair Wash",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
]);

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString(
    "en-NL",
    {
      month: "long",
    },
  );
});

async function openPopup(day: number) {
  selectedDay.value = day;
  selectedMonth.value = monthName;
  selectedYear.value = currentYear.value;
  clickedTime.value = false;
  selectedAppointment.value = null;
  showPopup.value = true;

  const month = String(currentMonth.value + 1).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  const date = `${currentYear.value}-${month}-${formattedDay}`;

  try {
    const response = await fetch(
        `http://localhost:3000/api/appointments?date=${date}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    appointments.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    appointments.value = [];
  }
}

async function fetchMonthAppointments() {
  const month = `${currentYear.value}-${String(
      currentMonth.value + 1,
  ).padStart(2, "0")}`;

  try {
    const response = await fetch(
        `http://localhost:3000/api/appointments/month?month=${month}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch monthly appointments");
    }

    monthAppointments.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch monthly appointments:", error);
    monthAppointments.value = [];
  }
}

function closePopup() {
  showPopup.value = false;
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }

  fetchMonthAppointments();
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }

  fetchMonthAppointments();
}

function timeSelected(time: string) {
  const startTime = time.substring(0, 5);

  const appointment = appointments.value.find(
      (appointment) => appointment.start_time.substring(0, 5) === startTime,
  );

  if (!appointment) {
    return;
  }

  selectedAppointment.value = appointment;
  clickedTime.value = true;
}

function isBooked(time: string) {
  const startTime = time.substring(0, 5);

  return appointments.value.some(
      (appointment) => appointment.start_time.substring(0, 5) === startTime,
  );
}

const daysInMonth = computed(() => {
  const amountOfDays = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();

  return Array.from({ length: amountOfDays }, (_, i) => i + 1);
});

function getDayColor(day: number) {
  const month = String(currentMonth.value + 1).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  const date = `${currentYear.value}-${month}-${formattedDay}`;

  const bookedSlots = monthAppointments.value.filter(
      (appointment) => appointment.appointment_date === date,
  ).length;

  if (bookedSlots === 0) {
    return "vacant-color";
  }

  if (bookedSlots === 10) {
    return "full-color";
  }

  return "booked-color";
}

fetchMonthAppointments();
</script>
