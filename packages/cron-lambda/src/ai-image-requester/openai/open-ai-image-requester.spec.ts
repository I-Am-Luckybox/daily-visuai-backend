import { ImageGenerateParamsNonStreaming } from "openai/resources";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { OpenAiImageRequester } from "./open-ai-image-requester.js";

const mocks = vi.hoisted(() => ({
    generateMock: vi.fn(),
}));

vi.mock("openai", async () => ({
    ...(await import("openai")),
    OpenAI: vi.fn().mockImplementation(() => ({
        images: {
            generate: mocks.generateMock,
        },
    })),
}));

describe("OpenAIImageRequester", () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.runAllTimersAsync();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("requestImage", () => {
        it("should fail gracefully if OpenAI server errors out", async () => {
            mocks.generateMock.mockRejectedValue(new Error("OpenAI server error"));
            const requester = new OpenAiImageRequester({ apiKey: "test_key" });
            const result = await requester.requestImage({ title: "Test Trend", context: ["context1", "context2"] });

            expect(result).toBe(undefined);
        });

        it("should request image from OpenAI", async () => {
            mocks.generateMock.mockResolvedValue({ data: [{ b64_json: "base64imagestring" }] });
            const requester = new OpenAiImageRequester({ apiKey: "test_key" });
            const result = await requester.requestImage({ title: "Test Trend", context: ["context1", "context2"] });

            expect(result).toEqual("base64imagestring");
        });

        it("should limit trend context count", async () => {
            mocks.generateMock.mockResolvedValue({ data: [{ b64_json: "base64imagestring" }] });
            const context = [];
            for (let i = 0; i < 100; i++) {
                context.push(`Context${i}`);
            }
            const requester = new OpenAiImageRequester({ apiKey: "test_key" });
            await requester.requestImage({ title: "Test Trend", context });
            let c = 0;
            const defaultLimit = 5;
            const generateArgument: ImageGenerateParamsNonStreaming = mocks.generateMock.mock.calls[0][0];
            for (; c < defaultLimit; c++) {
                expect(generateArgument.prompt).toContain(`Context${c}`);
            }
            expect(generateArgument.prompt).not.toContain(`Context${c}`);
        });
    });
});
