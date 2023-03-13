import UserModel from "../models/userModel.js";
import fs from "fs";
import { promisify } from "util";
import { uploadErrors } from "../utils/errors.utils.js";
import { pipeline as pipelineCallback } from "stream";
import path from "path";

const pipeline = promisify(pipelineCallback);

export const uploadProfile = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(400).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      // `${__dirname}/../client/public/uploads/profile/${fileName}`
      `${process.cwd()}/client/public/uploads/profile/${fileName}`
    )
  );

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profile/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
