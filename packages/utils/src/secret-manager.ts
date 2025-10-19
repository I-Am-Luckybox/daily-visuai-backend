import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

export class SecretManager {
    constructor(private readonly ssmClient: SSMClient) {}

    public async getSecret<SecretJson = object>(parameterName: string): Promise<SecretJson> {
        let secret: SecretJson;
        const result = await this.ssmClient.send(new GetParameterCommand({ Name: parameterName }));
        try {
            secret = JSON.parse(result.Parameter?.Value ?? "");
        } catch (error: unknown) {
            throw Error(`Failed to parse parameter ${parameterName}: ${error}`);
        }
        return secret;
    }
}
