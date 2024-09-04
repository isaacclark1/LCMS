import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

// Import routers.
import uc1Router from "./routes/uc1";
import uc2Router from "./routes/uc2";
import uc3Router from "./routes/uc3";
import uc4Router from "./routes/uc4";
import uc5Router from "./routes/uc5";
import uc6Router from "./routes/uc6";
import uc7Router from "./routes/uc7";
import uc8Router from "./routes/uc8";
import uc9Router from "./routes/uc9";
import uc10Router from "./routes/uc10";
import uc11Router from "./routes/uc11";
import uc12Router from "./routes/uc12";
import uc13Router from "./routes/uc13";
import uc14Router from "./routes/uc14";
import uiRouter from "./routes/ui";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
    }
  }
}

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use(cors());
app.use(express.json());

// Use routers
app.use("/uc1", uc1Router);
app.use("/uc2", uc2Router);
app.use("/uc3", uc3Router);
app.use("/uc4", uc4Router);
app.use("/uc5", uc5Router);
app.use("/uc6", uc6Router);
app.use("/uc7", uc7Router);
app.use("/uc8", uc8Router);
app.use("/uc9", uc9Router);
app.use("/uc10", uc10Router);
app.use("/uc11", uc11Router);
app.use("/uc12", uc12Router);
app.use("/uc13", uc13Router);
app.use("/uc14", uc14Router);
app.use("/ui", uiRouter);

app.use(express.static(path.join(__dirname, "client/")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});
