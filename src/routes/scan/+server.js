// #TODO: clean dependencies, refactor infinite floating variables
// #OPTIONAL-TODO: clean debugging outputs, loading bar for 10 sec ETA, option to download/copy to clipboard the output


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