import { backOff } from "exponential-backoff";
import { seededShuffle } from "utils";
import { GoogleTrendCategoryIds } from "../constants/google-trend-category.js";
import { Trend, TrendFetcher } from "../trend-fetcher.js";

class NoTrendsFoundException extends Error {}

export type SerpapiTrendingSearch = {
    query: string;
    start_timestamp: number;
    active: boolean;
    search_volume: number;
    increase_percentage: number;
    categories: { id: number; name: string }[];
    trend_breakdown: string[];
    serpapi_google_trends_link: string;
    news_page_token: string;
    serpapi_news_link: string;
};

export type SerpapiResponse = {
    search_metadata: {
        id: string;
        status: string;
        json_endpoint: string;
        created_at: string;
        processed_at: string;
        google_trends_trending_now_url: string;
        raw_html_file: string;
        prettify_html_file: string;
        total_time_taken: number;
    };
    search_parameters: {
        engine: string;
        hl: string;
        geo: string;
    };
    trending_searches: SerpapiTrendingSearch[];
};

export class SerpApiTrendFetcher extends TrendFetcher {
    private readonly categoryRankings: string[]; // Randomly shuffled, seeded by year-month-day
    private readonly baseUrl = "https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US";

    constructor(protected readonly credentials: { apiKey: string }) {
        super(credentials);

        const date = new Date();
        const dateSeed = `${date.getUTCFullYear()}${date.getUTCMonth() + 1}${date.getUTCDate()}`;
        this.categoryRankings = seededShuffle(Object.values(GoogleTrendCategoryIds), dateSeed);
    }

    async fetchTrends(max: number): Promise<Trend[]> {
        const trends: Trend[] = [];
        for (const categoryId of this.categoryRankings) {
            let trend: Trend | undefined;
            try {
                trend = await this.fetchCategory(categoryId);
            } catch (error: unknown) {
                this.logger.error(`Error fetching category ${categoryId}: ${error} ---- attempting next category...`);
            }
            if (trend) {
                trends.push(trend);
            }
            if (trends.length >= max) {
                return trends;
            }
        }
        return trends;
    }

    /**
     * Default search on Google is "ALL" which includes a lot of sports trends, which pollutes the results.
     * So search for specific other categories instead so we don't keep getting football trends...
     */
    private async fetchCategory(categoryId: string): Promise<Trend | undefined> {
        const trend: Trend | undefined = await backOff(
            async () => {
                const httpResponse = await fetch(`${this.baseUrl}&category_id=${categoryId}&api_key=${this.credentials?.apiKey}`);
                if (!httpResponse.ok) {
                    throw new Error(`Failed to fetch trends from SerpAPI: ${httpResponse.status} ${httpResponse.statusText}`);
                }
                const response: SerpapiResponse = await httpResponse.json();
                const trend = response.trending_searches.sort((a, b) => b.search_volume - a.search_volume)[0];
                if (!trend) {
                    throw new NoTrendsFoundException(`No trends found for category ${categoryId}`);
                }
                return { title: trend.query, context: trend.trend_breakdown };
            },
            {
                numOfAttempts: 5,
                maxDelay: 16000,
                startingDelay: 2000,
                retry: (error, attemptNumber) => {
                    this.logger.warn(`Attempt ${attemptNumber} to fetch trends for category ${categoryId} failed: ${error.message}`);
                    if (error instanceof NoTrendsFoundException) {
                        return false;
                    }
                    return true;
                },
            },
        );
        if (trend) {
            this.logger.info(`Fetched trend for category ${categoryId}: ${trend.title}`);
        }
        return trend;
    }
}
