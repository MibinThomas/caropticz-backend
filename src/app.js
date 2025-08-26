import cors from "cors";
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";
// import config from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userNotification from "./routes/userNotificationRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
const app = express();

// available file/folder from one server to another
app.use("/images", express.static(path.resolve("public/images")));

app.use(cors());
app.use(express.json());

app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications",userNotification)
app.use('/api/contact',contactRoutes)

app.get("/", (req, res) => {
  res.send("Server running successfully!");
});

const startServer = async () => {
  await connectDB();

  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
