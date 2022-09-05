import { x_api_key, api_url } from '$env/static/private';

export async function POST({request}) {
    const header = {
        "x-api-key": x_api_key
    };
    const response = await fetch(api_url, {
        method: "POST",
        headers: header,
        body: request.body
    });
    let scanned = await response.json();
    return new Response(scanned, {status: 200})
  }