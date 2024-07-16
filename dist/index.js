"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
mongoose_1.default.connect(config_1.MONGODBURI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error("Error connecting to DB:", err));
app.use("/admin", routes_1.AdminRoutes);
app.use("/vandor", routes_1.VandorRoutes);
app.use('/customer', routes_1.CustomerRoutes);
app.use('/delivery', routes_1.DeliveryRoutes);
app.use(routes_1.ShopingRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map