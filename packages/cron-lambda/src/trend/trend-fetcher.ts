import { Logger } from "utils";

export type TrendFetcherConfig = {
    apiKey: string;
};

export type Trend = {
    title: string;
    context?: string[];
};

export abstract class TrendFetcher {
    protected logger = Logger.create();

    constructor(protected readonly credentials?: TrendFetcherConfig) {}

    abstract fetchTrends(max: number): Promise<Trend[]>;
}
