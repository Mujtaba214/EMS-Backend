import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("Server running");
});
