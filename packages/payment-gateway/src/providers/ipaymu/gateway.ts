/**
 * iPaymu Payment Gateway Implementation
 *
 * Documentation: https://ipaymu.com/api
 * Sandbox: https://sandbox.ipaymu.com
 */

import { PaymentGateway } from "../../abstract";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  GatewayConfig,
} from "../../types";
import type { IpaymuApiResponse } from "./types";

/**
 * Generate SHA256 hash of a string
 */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate HMAC-SHA256 signature
 */
async function hmacSha256(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * iPaymu Payment Gateway
 *
 * Implements payment creation via iPaymu's /api/v2/payment endpoint.
 * Uses SHA256 body hash + HMAC-SHA256 signature for authentication.
 */
export class IpaymuGateway extends PaymentGateway {
  readonly name = "ipaymu";
  readonly displayName = "iPaymu";

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly va: string;

  constructor(config: GatewayConfig) {
    super();
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.va = config.va ?? "";
  }

  async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    const endpoint = `${this.baseUrl}/api/v2/payment`;

    // Build request body per iPaymu format
    const body = {
      product: [request.productName],
      qty: [String(request.quantity)],
      price: [String(request.amount)],
      amount: String(request.amount),
      returnUrl: request.returnUrl,
      cancelUrl: request.cancelUrl,
      notifyUrl: request.notifyUrl,
      referenceId: request.referenceId,
    };

    const bodyString = JSON.stringify(body);

    // Generate signature per iPaymu specification
    const bodyHash = await sha256(bodyString);
    const stringToSign = `POST:${this.va}:${bodyHash}:${this.apiKey}`;
    const signature = await hmacSha256(stringToSign, this.apiKey);

    // Generate timestamp in format YYYYMMDDHHmmss
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          va: this.va,
          signature,
          timestamp,
        },
        body: bodyString,
      });

      const result = (await response.json()) as IpaymuApiResponse;

      if (result.Status === 200 && result.Data) {
        return {
          success: true,
          paymentUrl: result.Data.Url,
          sessionId: result.Data.SessionId,
        };
      }

      return {
        success: false,
        paymentUrl: "",
        sessionId: "",
        errorMessage: result.Message || "Payment creation failed",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[IpaymuGateway] Error creating payment:", errorMessage);

      return {
        success: false,
        paymentUrl: "",
        sessionId: "",
        errorMessage: `Failed to connect to iPaymu: ${errorMessage}`,
      };
    }
  }
}
