import { beforeEach } from "node:test";
import { DeepOptional } from "utils";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoogleTrendCategoryIds } from "../constants/google-trend-category.js";
import { SerpApiTrendFetcher, SerpapiResponse } from "./serpapi-trend-fetcher.js";

describe("SerpApiTrendFetcher", () => {
    beforeAll(async () => {
        vi.useFakeTimers();
        vi.runAllTimersAsync();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchTrends", () => {
        it("should fetch trends from SerpApi", async () => {
            const apiResponseJson: DeepOptional<SerpapiResponse> = {
                trending_searches: [{ query: "Trend 1" }, { query: "Trend 2" }],
            };
            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: true,
                json: async () => apiResponseJson,
            } as Response);

            const fetcher = new SerpApiTrendFetcher({ apiKey: "test_key" });
            const maxCategories = 3;
            const trends = await fetcher.fetchTrends(maxCategories);
            expect(fetchSpy).toHaveBeenCalledTimes(maxCategories);
            expect(trends).toEqual([{ title: "Trend 1" }, { title: "Trend 1" }, { title: "Trend 1" }]);
        });

        it("should handle API errors gracefully", async () => {
            const apiResponseJson: DeepOptional<SerpapiResponse> = {
                trending_searches: [{ query: "Trend 2" }],
            };
            const fetchSpy = vi.spyOn(globalThis, "fetch");
            fetchSpy.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            } as Response);
            fetchSpy.mockResolvedValue({
                ok: true,
                json: async () => apiResponseJson,
            } as Response);

            const fetcher = new SerpApiTrendFetcher({ apiKey: "test_key" });
            const maxCategories = 2;
            const trends = await fetcher.fetchTrends(maxCategories);
            expect(fetchSpy).toHaveBeenCalledTimes(3);
            expect(trends).toEqual([{ title: "Trend 2" }, { title: "Trend 2" }]);
        });

        it("should timeout successfully if server errors out", async () => {
            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            } as Response);

            const fetcher = new SerpApiTrendFetcher({ apiKey: "test_key" });
            const maxCategories = 1;
            const trends = await fetcher.fetchTrends(maxCategories);
            expect(fetchSpy).toHaveBeenCalledTimes(Object.keys(GoogleTrendCategoryIds).length * 5);
            expect(trends).toEqual([]);
        });
    });
});
