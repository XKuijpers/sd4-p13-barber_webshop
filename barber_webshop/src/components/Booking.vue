<template>
  <div id="bookingSection" class="pt-16 md:pt-30 lg:pt-55">
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
              :class="{ 'full-color': isTimeSlotBooked(time) }"
            >
              <p
                @click="selectTimeSlot(time)"
                class="h4 group-hover:text-white"
              >
                {{ time }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="clickedTime" class="ml-auto w-fit flex-col gap-y-3">
          <div class="flex flex-row">
            <div class="flex flex-col gap-y-3">
              <div
                v-for="service in serviceList"
                :key="service.name"
                class="h2 grid grid-cols-6 items-center"
              >
                <i
                  v-if="service.atMaxPlus"
                  @click="counterUp(service)"
                  class="text-highlight fa-solid fa-square-plus col-span-1 mx-auto hover:cursor-pointer"
                ></i>
                <i
                  v-if="service.atMaxMin"
                  @click="counterDown(service)"
                  class="fa-solid fa-square-minus col-span-1 mx-auto text-red-900 hover:cursor-pointer"
                ></i>

                <div class="accent mx-auto w-8 rounded-full">
                  <div class="h4 col-span-1 text-center">
                    {{ service.counter }}
                  </div>
                </div>

                <div class="h4 col-span-3 mr-auto pl-2">
                  {{ service.name }}
                </div>
              </div>

              <input
                v-model="customerPhone"
                class="border-accent mx-8 mt-auto border-b-4 md:mr-8 md:ml-0"
                type="tel"
                pattern="(\+31 6|06) [0-9]{8}"
                placeholder="+31 6 12345678"
              />

              <input
                v-model="customerEmail"
                class="border-accent mx-8 border-b-4 md:mr-8 md:ml-0"
                type="email"
                placeholder="email@gmail.com"
              />
            </div>
          </div>
        </div>

        <div
          v-if="clickedTime"
          @click="submitAppointment"
          class="border-highlight h4 highlight-button mx-8 my-4 w-fit border-4 px-3 py-1 text-center hover:cursor-pointer hover:text-white md:ml-auto"
        >
          Submit Appointment
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const API_URL = "http://localhost:3000";

const appointments = ref([]);
const monthAppointments = ref([]);
const loadingAppointments = ref(false);

let clickedTime = ref(false);

const selectedTime = ref("");
const customerPhone = ref("");
const customerEmail = ref("");

const submittingAppointment = ref(false);

const currentMonth = ref(0);
const currentYear = ref(2026);

const showPopup = ref(false);

const selectedDay = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);

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
    id: 1,
    name: "Haircut",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    id: 2,
    name: "Beard Trim",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    id: 3,
    name: "Cleanshave",
    counter: 0,
    atMaxMin: false,
    atMaxPlus: true,
  },
  {
    id: 4,
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

function openPopup(day: number) {
  selectedDay.value = day;
  selectedMonth.value = monthName;
  selectedYear.value = currentYear.value;
  showPopup.value = true;

  clickedTime.value = false;

  fetchAppointments();
}

async function fetchAppointments() {
  if (selectedDay.value === null) {
    return;
  }

  loadingAppointments.value = true;

  try {
    const month = String(currentMonth.value + 1).padStart(2, "0");
    const day = String(selectedDay.value).padStart(2, "0");

    const date = `${currentYear.value}-${month}-${day}`;

    const response = await fetch(`${API_URL}/api/appointments?date=${date}`);

    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }

    appointments.value = await response.json();

    console.log("Appointments:", appointments.value);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    appointments.value = [];
  } finally {
    loadingAppointments.value = false;
  }
}

async function fetchMonthAppointments() {
  try {
    const month = `${currentYear.value}-${String(
      currentMonth.value + 1,
    ).padStart(2, "0")}`;

    const response = await fetch(
      `${API_URL}/api/appointments/month?month=${month}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch monthly appointments");
    }

    monthAppointments.value = await response.json();

    console.log("Month appointments:", monthAppointments.value);
  } catch (error) {
    console.error("Failed to fetch monthly appointments:", error);
    monthAppointments.value = [];
  }
}

function isTimeSlotBooked(time: string) {
  const startTime = time.split(" - ")[0];

  return appointments.value.some(
    (appointment) => appointment.start_time === `${startTime}:00`,
  );
}

function selectTimeSlot(time: string) {
  if (isTimeSlotBooked(time)) {
    return;
  }

  timeSelected(time);
}

function getDayStatus(day: number) {
  const bookedSlots = appointments.value.length;

  if (bookedSlots === 0) {
    return "vacant-color";
  }

  if (bookedSlots === timeSlots.length) {
    return "full-color";
  }

  return "booked-color";
}

function closePopup() {
  showPopup.value = false;
}

function counterUp(service) {
  if (service.counter === 1) {
    service.atMaxPlus = true;
  } else {
    service.counter++;
    service.atMaxPlus = false;
    service.atMaxMin = true;
  }
}

function counterDown(service) {
  if (service.counter === 0) {
    service.atMaxMin = true;
  } else {
    service.counter--;
    service.atMaxMin = false;
    service.atMaxPlus = true;
  }
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
  selectedTime.value = time;
  clickedTime.value = true;
}

const daysInMonth = computed(() => {
  const amountOfDays = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();

  return Array.from({ length: amountOfDays }, (_, i) => i + 1);
});

async function submitAppointment() {
  if (
    selectedDay.value === null ||
    !selectedTime.value ||
    !customerPhone.value ||
    !customerEmail.value
  ) {
    return;
  }

  const phonePattern = /^(?:\+31 6|06) [0-9]{8}$/;

  if (!phonePattern.test(customerPhone.value)) {
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(customerEmail.value)) {
    return;
  }

  const serviceIds = serviceList.value
    .filter((service) => service.counter > 0)
    .map((service) => service.id);

  if (serviceIds.length === 0) {
    return;
  }

  submittingAppointment.value = true;

  try {
    const month = String(currentMonth.value + 1).padStart(2, "0");
    const day = String(selectedDay.value).padStart(2, "0");

    const appointmentDate = `${currentYear.value}-${month}-${day}`;
    const startTime = selectedTime.value.split(" - ")[0];

    const response = await fetch(`${API_URL}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment_date: appointmentDate,
        start_time: startTime,
        customer_phone: customerPhone.value,
        customer_email: customerEmail.value,
        service_ids: serviceIds,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create appointment");
    }

    console.log("Appointment created:", data);

    resetAppointmentForm();

    closePopup();
  } catch (error) {
    console.error("Failed to submit appointment:", error);
  } finally {
    submittingAppointment.value = false;
  }

  await fetchMonthAppointments();
}

function resetAppointmentForm() {
  selectedTime.value = "";
  customerPhone.value = "";
  customerEmail.value = "";

  serviceList.value.forEach((service) => {
    service.counter = 0;
    service.atMaxMin = false;
    service.atMaxPlus = true;
  });
}

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

  if (bookedSlots === timeSlots.length) {
    return "full-color";
  }

  return "booked-color";
}

fetchMonthAppointments();
</script>
