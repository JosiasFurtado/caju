export function fetchAPI<Payload>(
  url: string,
  options?: RequestInit
): Promise<Payload> {
  return fetch(url, options)
    .then(response => {
      return response.json()
    })
    .catch(response => {
      throw new Error(response)
    })
}
