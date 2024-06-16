"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const study_1 = __importDefault(require("./study"));
const media_download_1 = __importDefault(require("./media.download"));
const router = express_1.default.Router();
router.use("/study", study_1.default);
router.use("/media", media_download_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map