import { Logger } from "./logger.js";

const logger = Logger.create();

export const handler = async () => {
    logger.info("Test");
    return new Error("Not implemented");
};
