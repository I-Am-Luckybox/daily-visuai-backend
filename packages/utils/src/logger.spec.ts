import { describe, expect, it, vitest } from "vitest";
import { Logger } from "./logger.js";

vitest.spyOn(Logger, "create");

describe("logger", () => {
    describe("create", () => {
        it("should create a logger instance", () => {
            const logger = Logger.create();
            expect(logger).toBeDefined();
            expect(Logger.create).toHaveBeenCalled();
        });

        it("should create same instance on multiple calls", () => {
            const logger1 = Logger.create();
            const logger2 = Logger.create();
            expect(logger1).toBe(logger2);
        });
    });
});
