import { describe, expect, it } from "vitest";
import { seededShuffle } from "./shuffle.js";

describe("seededShuffle", () => {
    it("should shuffle an array consistently with the same seed", () => {
        const array = [1, 2, 3, 4, 5];
        const seed = "2025-01-01";
        const shuffled1 = seededShuffle(array, seed);
        const shuffled2 = seededShuffle(array, seed);
        expect(shuffled1).toEqual(shuffled2);
        expect(shuffled1).not.toEqual(array);
    });

    it("should produce different shuffles with different seeds", () => {
        const array = [1, 2, 3, 4, 5];
        const seed1 = "2025-01-01";
        const seed2 = "2025-01-02";
        const shuffled1 = seededShuffle(array, seed1);
        const shuffled2 = seededShuffle(array, seed2);
        expect(shuffled1).not.toEqual(shuffled2);
    });

    it("should not mutate the original array", () => {
        const array = [1, 2, 3, 4, 5];
        const seed = "2025-01-01";
        const arrayCopy = array.slice();
        seededShuffle(array, seed);
        expect(array).toEqual(arrayCopy);
    });

    it("should handle empty arrays", () => {
        const array: number[] = [];
        const seed = "2025-01-01";
        const shuffled = seededShuffle(array, seed);
        expect(shuffled).toEqual([]);
    });
});
