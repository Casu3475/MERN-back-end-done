import express from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/AuthController.js"; // ROUTES --> CONTROLLERS
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
} from "../controllers/UserController.js"; // ROUTES --> CONTROLLERS
import { uploadProfile } from "../controllers/UploadController.js"; // ROUTES --> CONTROLLERS

const router = express.Router();
const upload = multer();

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// user db
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unfollow);

// upload
router.post("/upload", upload.single("file"), uploadProfile);

export default router;
