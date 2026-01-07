import { apiRequest } from "../httpClient";

export type OtpPayload = { email: string };
export type LoginPayload = { email: string; otp: string };

export const getOtp = (body: OtpPayload) =>
  apiRequest<{ ok: boolean }, OtpPayload>({
    path: "/api/core/auth/otp",
    method: "POST",
    body,
    throwOnError: true,
  });

export const login = (body: LoginPayload) =>
  apiRequest<{ ok: boolean }, LoginPayload>({
    path: "/api/core/auth/login",
    method: "POST",
    body,
    throwOnError: true,
  });