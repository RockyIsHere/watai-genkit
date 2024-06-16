import express from "express";
import studyRoute from "./study";
import mediaDownloadRoute from "./media.download";

const router = express.Router();
router.use("/study", studyRoute);
router.use("/media", mediaDownloadRoute);

export default router;
