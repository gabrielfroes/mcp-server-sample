import "dotenv/config";
import { PriceByZipCodeInput, PriceByZipCodeResult } from "../../domain/models/PriceByCep.js";

export class PriceByCepService {
  private readonly API_URL = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";
  private readonly USER_AGENT = "Aplicação (email para contato técnico)";
  private readonly TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjVlMjM5ZmQ4NWQ5NzA4MDgyNzViODc5OGFkYWIyMmM5ZDBlMzE1MjEzNjdhNGIzM2FmOTJhYjNmMTQyMmQwZDhiZWNiMDM2YmFhNTQwOTciLCJpYXQiOjE3NDc1NzcwMzYuMTIwNTU3LCJuYmYiOjE3NDc1NzcwMzYuMTIwNTU5LCJleHAiOjE3NzkxMTMwMzYuMTEwNTA2LCJzdWIiOiI5ZWUzNTk0ZC1iNTM2LTQ0M2MtOTU4NC1hZWZlYWIxNzNkOTAiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.Rr0YzfhJGrcykcspex0MTtbbhS1TojIUmbyidlovY6oirX79TDOigJgqMfWmu9BFzzNOLpXeJqCAtR-ATa3WgrDswhlCEcByiSg9ZO5rEBWYt2LfaLwKYLUc3a7c86z_P6xRX3WdzmtiaXdyBMr8pe5QuDmUy5GdQWq7Q1WMakQmxqlo4xR5cWWdSoCKhScKcwKy_B8WgTTiiyHg-EupOng0vQXpBwwDHsAi1gen5yGwX50i30XtJksIjuB9vURg9HgmCZqIL-Ea_G_c3YIwstA0siIuBb-hzWlvkaN-Zf6bQswLc2Z3QZxr7vBwcMpF7KIcNN7ZfHCdOkqBH9NmjTgReI72iZJodIWptDBUxshghEtkLSG07mUd9bzxPIwQ0yNuAdlnZmJFlbda29Bh_0qaCozSwFRblZ9PDZ5b4w9Va96jmQz_g6Lg20hjlrDp5hvgsnFxasu_VdFY7ukKIWNA0Q3JMO3EiHDQ-hVz3J23WeWHr8sfTc2VmnAizPv74kTzUL0VjxDXvBZo0_DLx0dj2iUnVQ8vjOhtZuhReK7wUwWrHuruJMSewU7LBmi-fEaZ6krSfkZnkoo7X9xsV7EGdOZbcZPcMArXh1FGLweVOJeVixYGSIKMgkst_T0GpHRQFBJWxhpZ9pZbxayTSWGcgHv3iN_8Es4S2pexkNw";
  

  async getPrices(input: PriceByZipCodeInput): Promise<PriceByZipCodeResult[]> {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": this.USER_AGENT,
      },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      name: item.name,
      price: item.price,
      custom_price: item.custom_price,
    }));
  }
}


