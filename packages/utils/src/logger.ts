import { pino, Logger as PinoLogger } from "pino";

export class Logger {
    private static logger: PinoLogger;

    private constructor() {
    }

    public static create(): PinoLogger {
        if (this.logger) {
            return this.logger;
        }
        this.logger = pino();
        return this.logger;
    }
}