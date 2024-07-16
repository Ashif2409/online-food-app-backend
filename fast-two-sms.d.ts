declare module 'fast-two-sms' {
    interface Fast2SMSOptions {
        authorization: string;
        message: string;
        numbers: string[];
    }

    function sendMessage(options: Fast2SMSOptions): Promise<any>;

    export = { sendMessage };
}
