"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TodoRoute_js_1 = __importDefault(require("./routes/TodoRoute.js"));
const UserRoute_js_1 = __importDefault(require("./routes/UserRoute.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const authMiddleware_js_1 = __importDefault(require("./middleware/authMiddleware.js"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true,
}));
app.use("/", express_1.default.static(path_1.default.join(process.cwd())));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/auth", auth_route_js_1.default);
app.use("/users", UserRoute_js_1.default);
app.use(authMiddleware_js_1.default);
app.use("/todos", TodoRoute_js_1.default);
exports.default = app;
