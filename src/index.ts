import { config } from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import measureRoutes from "./routes/measureRoutes";
import { teste } from "./services/geminiService";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(loggerMiddleware);

// rotas:
app.use("/", measureRoutes);

//Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
