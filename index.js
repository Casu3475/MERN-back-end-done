import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { checkUser, requiredAuth } from "./middleware/AuthMiddleware.js";

// INDEX --> ROUTES --> controllers --> models --> DB
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";

// initializations
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

// middleware
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

dotenv.config();

// JWT
app.get("*", checkUser); // a chaque connexion, tu me checkes l'utilisateur
app.get("/jwtid", requiredAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// variables
// const PORT = process.env.PORT;
// const CONNECTION = process.env.MONGODB_CONNECTION;

// connect to mongodb
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@casu.usuxxbd.mongodb.net/rom_db?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() =>
    app.listen(5000, () => console.log(`Connected to MongoDB on Port 5000`))
  )
  .catch((err) => console.log(`${err} Failed to connect to MongoDB`));

// routes usage
app.use("/user", UserRoutes);
app.use("/post", PostRoutes);
