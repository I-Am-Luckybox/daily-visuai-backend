import { OpenAI } from "openai";
import { AiImageRequester, AiImageRequesterConfig } from "../ai-image-requester.js";
import { Trend } from "../../trend/trend-fetcher.js";
import { backOff } from "exponential-backoff";

export class OpenAiImageRequester extends AiImageRequester {
    private readonly DEFAULT_GENERATE_CONFIG: Partial<OpenAI.ImageGenerateParamsNonStreaming> = {
        model: "dall-e-3", // gpt-image-1 costs more and requires org authentication by sending OpenAI a photo of your face. Dall-E-2 just sucks.
        size: "1024x1024",
        response_format: "b64_json",
        style: "vivid",
    };
    private readonly DEFAULT_TREND_CONTEXT_LENGTH = 5;
    private readonly defaultPrompt = (trendTitle: string) =>
        `A detailed image representing the following trend, make sure it is hyper-realistic photo realism: ${trendTitle}`;
    private readonly defaultContextPrompt = (context: string[]) =>
        ` for extra context, try to illustrate: ${context.slice(0, this.DEFAULT_TREND_CONTEXT_LENGTH).join(", ")} `;
    private readonly contentPolicyPrompt = ` do not process context that violates content policies`;
    private readonly client: OpenAI;

    constructor(config: AiImageRequesterConfig) {
        super(config);
        this.client = new OpenAI({ apiKey: config.apiKey });
    }

    async requestImage(trend: Trend): Promise<string | undefined> {
        const prompt = this.defaultPrompt(trend.title) + ((trend.context ? this.defaultContextPrompt(trend.context) : "") + this.contentPolicyPrompt);
        this.logger.info(`Requesting image for trend "${trend.title}" with prompt: ${prompt}`);
        let result: string | undefined;

        try {
            result = await backOff(
                async () => {
                    const response = await this.client.images.generate({
                        prompt,
                        ...this.DEFAULT_GENERATE_CONFIG,
                    });
                    if (response.data?.length === 0) {
                        throw new Error("No image URL returned from OpenAI");
                    }
                    return response.data?.[0].b64_json;
                },
                {
                    numOfAttempts: 5,
                    maxDelay: 16000,
                    startingDelay: 5000,
                    retry: (error, attemptNumber) => {
                        this.logger.warn(`Attempt ${attemptNumber} to request image for trend "${trend.title}" failed: ${error}`);
                        return true;
                    },
                },
            );
        } catch (error: unknown) {
            this.logger.error(`Failed to request image for trend "${trend.title}": ${error}`);
        }

        return result;
    }
}
