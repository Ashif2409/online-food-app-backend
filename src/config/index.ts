import * as dotenv from "dotenv";
dotenv.config();
export const MONGODBURI=`mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.MONGODBPASS}@cluster0.ffeb0yn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/onlineFood`
export const APP_SECRET="Our_App_Secret"
