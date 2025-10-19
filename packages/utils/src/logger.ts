import { Logger as PinoLogger, pino } from "pino";

export class Logger {
    private static logger: PinoLogger;

    private constructor() {}

    public static create(): PinoLogger {
        if (Logger.logger) {
            return Logger.logger;
        }
        Logger.logger = pino();
        return Logger.logger;
    }
}
