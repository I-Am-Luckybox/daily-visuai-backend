import random from "random";

export function seededShuffle<T>(array: T[], seed: number | string): T[] {
    random.use(seed);
    return random.shuffle(array);
}
