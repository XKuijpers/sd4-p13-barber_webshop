require("dotenv").config();

const nodemailer = require("nodemailer");

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Barber webshop API is running!" });
});

async function sendConfirmationEmail(
  customerEmail,
  appointmentDate,
  startTime,
  serviceIds,
) {
  const [services] = await db.query(
    `
        SELECT name, price
        FROM services
        WHERE id IN (?)
        `,
    [serviceIds],
  );

  const serviceList = services
    .map((service) => `${service.name} - €${service.price}`)
    .join("\n");

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: customerEmail,
    subject: "Your Barber Webshop Confirmation",
    text: `
Your appointment has been successfully booked!

Date: ${appointmentDate}
Time: ${startTime}

Services:
${serviceList}

We look forward to seeing you!

Yours sincerely,
Barber Webshop
        `,
  });
}

app.get("/api/appointments", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      message: "Date is required",
    });
  }

  try {
    const [rows] = await db.query(
        `
            SELECT
                a.id,
                a.appointment_date,
                a.start_time,
                a.customer_phone,
                a.customer_email,
                GROUP_CONCAT(s.name) AS services
            FROM appointments a
            LEFT JOIN appointment_services aps
                ON a.id = aps.appointment_id
            LEFT JOIN services s
                ON aps.service_id = s.id
            WHERE a.appointment_date = ?
            GROUP BY a.id
            ORDER BY a.start_time
            `,
        [date],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve appointments",
    });
  }
});

app.post("/api/appointments", async (req, res) => {
  const {
    appointment_date,
    start_time,
    customer_phone,
    customer_email,
    service_ids,
  } = req.body;

  if (
    !appointment_date ||
    !start_time ||
    !customer_phone ||
    !customer_email ||
    !service_ids ||
    service_ids.length === 0
  ) {
    return res.status(400).json({
      message: "Missing appointment information",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check whether the slot is already booked
    const [existing] = await connection.query(
      `
            SELECT id
            FROM appointments
            WHERE appointment_date = ?
            AND start_time = ?
            `,
      [appointment_date, start_time],
    );

    if (existing.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    // Create appointment
    const [appointment] = await connection.query(
      `
            INSERT INTO appointments
            (appointment_date, start_time, customer_phone, customer_email)
            VALUES (?, ?, ?, ?)
            `,
      [appointment_date, start_time, customer_phone, customer_email],
    );

    // Add selected services
    for (const serviceId of service_ids) {
      await connection.query(
        `
                INSERT INTO appointment_services
                (appointment_id, service_id)
                VALUES (?, ?)
                `,
        [appointment.insertId, serviceId],
      );
    }

    await connection.commit();

    try {
      await sendConfirmationEmail(
        customer_email,
        appointment_date,
        start_time,
        service_ids,
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    res.status(201).json({
      message: "Appointment created successfully",
      appointment_id: appointment.insertId,
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to create appointment",
    });
  } finally {
    connection.release();
  }
});

app.get("/api/appointments/month", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({
      message: "Month is required",
    });
  }

  try {
    const [rows] = await db.query(
      `
            SELECT
    DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date,
    start_time
FROM appointments
            WHERE DATE_FORMAT(appointment_date, '%Y-%m') = ?
            ORDER BY appointment_date, start_time
            `,
      [month],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve monthly appointments",
    });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      message: "Login successful",
    });
  }

  res.status(401).json({
    message: "Invalid username or password",
  });
});

module.exports = app;
