import * as dotenv from "dotenv";
import twilio from 'twilio';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    try {
        const fullPhoneNumber = `+91${toPhoneNumber}`;
        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioPhoneNumber,
            to: fullPhoneNumber
        });
        return message;
    } catch (error: any) {
        if (error.code === 21408) {
            console.error("Error sending OTP: Permission to send SMS has not been enabled for the region indicated by the 'To' number.");
        } else {
            console.error("Error sending OTP:", error);
        }
        throw new Error('Failed to send OTP');
    }
};
