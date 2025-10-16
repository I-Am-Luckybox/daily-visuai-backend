import { describe, expect, it, vi } from "vitest";
import { SecretManager } from "./secret-manager.js";
import { SSMClient } from "@aws-sdk/client-ssm";

const mocks = vi.hoisted(() => ({
    mockSend: vi.fn(),
}));

vi.mock("@aws-sdk/client-ssm", async () => ({
    ...(await import("@aws-sdk/client-ssm")),
    SSMClient: vi.fn().mockImplementation(() => ({
        send: mocks.mockSend,
    })),
}));

describe("SecretManager", () => {
    describe("getSecret", () => {
        it("should fetch secret from AWS SSM", async () => {
            type SecretType = {
                secretA: string;
                secretB: string;
            };
            const mockReturnSecretObj: SecretType = { secretA: "123", secretB: "456" };
            mocks.mockSend.mockResolvedValueOnce({ Parameter: { Value: JSON.stringify(mockReturnSecretObj) } });

            const secretManager = new SecretManager(new SSMClient({}));

            const secret = await secretManager.getSecret<SecretType>("test");
            expect(secret).toBeDefined();
            expect(secret.secretA).toBe("123");
            expect(secret.secretB).toBe("456");
        });

        it("should throw error", async () => {
            type SecretType = {
                secretA: string;
            };
            mocks.mockSend.mockResolvedValueOnce({ Parameter: { Value: undefined } });

            const secretManager = new SecretManager(new SSMClient({}));

            expect(secretManager.getSecret<SecretType>("test")).rejects.toThrowError();
        });
    });
});
