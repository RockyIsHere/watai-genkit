"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wp_message_1 = __importDefault(require("../webhook/wp.message"));
const grammer_check_1 = require("../actions/grammer.check");
const paraphraser_1 = require("../actions/paraphraser");
const synonyms_1 = require("../actions/synonyms");
const antonyms_1 = require("../actions/antonyms");
const english_poem_1 = require("../actions/english.poem");
const quotes_1 = require("../actions/quotes");
const router = express_1.default.Router();
//?? Grammer Checker
router.post("/grammer-checker", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(grammer_check_1.grammerCheckFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/paraphraser", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(paraphraser_1.paraphraserFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/synonyms", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(synonyms_1.synonymsFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/antonyms", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(antonyms_1.antonymsFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/english-poem", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(english_poem_1.englishPoemFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/quotes", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(quotes_1.quotesFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
exports.default = router;
//# sourceMappingURL=study.js.map