import express, { Request, Response, NextFunction,Application } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bodyParser from 'body-parser';
import { VandorRoutes, AdminRoutes, DeliveryRoutes, ShopingRoutes, CustomerRoutes } from './routes';
import { MONGODBURI } from './config';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
mongoose.connect(MONGODBURI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error("Error connecting to DB:", err));


app.use("/admin", AdminRoutes);
app.use("/vandor", VandorRoutes);
app.use('/customer', CustomerRoutes);
app.use('/delivery', DeliveryRoutes);
app.use(ShopingRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
