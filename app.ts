import "dotenv/config";
import express from "express";
import cors from "cors";
import headersMiddleware from "./src/middlewares/headers.middleware";
import memberRoutes from "./src/routes/member.route";

const app = express();

app.use(express.json({ strict: false }));
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(headersMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Budget Committee Backend!");
});

app.use("/member", memberRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
