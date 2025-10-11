import random from "random";

export function seededShuffle<T>(array: T[], seed: number | string): T[] {
    random.use(seed);

    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random.int() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
