"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./utils/logger"));
const dates_1 = __importDefault(require("./routes/dates"));
const path_1 = require("path");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/dates', dates_1.default);
app.use(express_1.default.static((0, path_1.join)(__dirname, '../src/public')));
app.get('/', (req, res) => {
    res.sendFile((0, path_1.join)(__dirname, '../src/public/index.html'));
});
app.listen(process.env.PORT, () => logger_1.default.info(`Server is running on port ${process.env.PORT}`));
