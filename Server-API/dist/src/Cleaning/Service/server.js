"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Import routers.
const uc1_1 = __importDefault(require("./routes/uc1"));
const uc2_1 = __importDefault(require("./routes/uc2"));
const uc3_1 = __importDefault(require("./routes/uc3"));
const uc4_1 = __importDefault(require("./routes/uc4"));
const uc5_1 = __importDefault(require("./routes/uc5"));
const uc6_1 = __importDefault(require("./routes/uc6"));
const uc7_1 = __importDefault(require("./routes/uc7"));
const uc8_1 = __importDefault(require("./routes/uc8"));
const uc9_1 = __importDefault(require("./routes/uc9"));
const uc10_1 = __importDefault(require("./routes/uc10"));
const uc11_1 = __importDefault(require("./routes/uc11"));
const uc12_1 = __importDefault(require("./routes/uc12"));
const uc13_1 = __importDefault(require("./routes/uc13"));
const uc14_1 = __importDefault(require("./routes/uc14"));
const ui_1 = __importDefault(require("./routes/ui"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Use routers
app.use("/uc1", uc1_1.default);
app.use("/uc2", uc2_1.default);
app.use("/uc3", uc3_1.default);
app.use("/uc4", uc4_1.default);
app.use("/uc5", uc5_1.default);
app.use("/uc6", uc6_1.default);
app.use("/uc7", uc7_1.default);
app.use("/uc8", uc8_1.default);
app.use("/uc9", uc9_1.default);
app.use("/uc10", uc10_1.default);
app.use("/uc11", uc11_1.default);
app.use("/uc12", uc12_1.default);
app.use("/uc13", uc13_1.default);
app.use("/uc14", uc14_1.default);
app.use("/ui", ui_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "client/")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "client/index.html"));
});
