import { Logger } from "utils";

const logger = Logger.create();

export const handler = async () => {
    logger.info("Test");
    return new Error("Not implemented");
};
