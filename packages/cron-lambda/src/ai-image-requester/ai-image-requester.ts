import { Logger } from "utils";
import { Trend } from "../trend/trend-fetcher.js";

export type AiImageRequesterConfig = {
    apiKey: string;
};

export abstract class AiImageRequester {
    protected logger = Logger.create()

    constructor(protected readonly config: AiImageRequesterConfig) {}

    abstract requestImage(trend: Trend): Promise<string | undefined>;
}
