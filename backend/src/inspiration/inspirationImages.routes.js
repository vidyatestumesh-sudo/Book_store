const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require("./inspirationImages.controller");

router.get("/", controller.getImages);
router.post("/upload", upload.single("image"), controller.uploadImage);
router.delete("/:id", controller.deleteImage);

module.exports = router;
