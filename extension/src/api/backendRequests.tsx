import { amazonProductAttributes } from "../contentScript/amazon/amazonProductAttributes";
import { getAuthToken } from "../utility/auth";
import { Product, Promotion, SearchRequestForm } from "./backendModels";


export async function getProductByAsin(asin: string) {

  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
  };

  const base = new URL("/", process.env.BACKEND_HOSTNAME)
  const route = new URL(`/products/by/asin/${asin}`, base);

  return await fetch(route.href, requestOptions)
    .then((response) => response.json() as Promise<Product>)
    .catch((err) => {
      Promise.reject(err);
    });
}


export async function sendSearchForInfluencerRequest(
  searchRequest: SearchRequestForm
) {
  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchRequest),
    signal: controller.signal,
  };


  const base = new URL("/", process.env.BACKEND_HOSTNAME)
  const promotionsUrl = new URL("/promotions/get/", base);

  console.log(base, promotionsUrl.href)
  return await fetch(promotionsUrl.href, requestOptions)
    .then((response) => response.json() as Promise<Promotion[]>)
    .catch((err) => {
      Promise.reject(err);
    });
}

export enum AlertTypeEnum {
  NCP = "NCP"
}

export interface SubscribeToProductRequest {
  alert_type: AlertTypeEnum,
  product: {
    product_id_value: string,
    product_id_type: string
  }
}

export async function sendSubsribeToProductDiscount(
  subscribeToProductRequest: SubscribeToProductRequest
) {
  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 5000);


  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Token ' + await getAuthToken(),
    },
    body: JSON.stringify(subscribeToProductRequest),
    signal: controller.signal,
  };

  const base = new URL("/", process.env.BACKEND_HOSTNAME)
  const promotionsUrl = new URL("api/unboxr/products-alerts/", base);

  console.log(requestOptions)

  return await fetch(promotionsUrl.href, requestOptions)
    .then((response) => response.json() as Promise<Promotion[]>)
    .catch((err) => {
      Promise.reject(err);
    });
}

export async function getAlertForUserByAsin(asin: string) {

  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Token ' + await getAuthToken(),
    },
    signal: controller.signal,
  };

  console.log(process.env.BACKEND_HOSTNAME)
  const base = new URL("/", process.env.BACKEND_HOSTNAME)
  const route = new URL(`api/unboxr/products-alerts/${asin}`, base);

  return await fetch(route.href, requestOptions)
    .then((response) => {
      response.json()
    })
    .catch((err) => {
      Promise.reject(err);
    });
}