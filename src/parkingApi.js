const PROXY_URL = 'https://api.allorigins.win/get?url=';
const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1';
const API_KEY = process.env.REACT_APP_PARKING_API_KEY;

async function fetchJsonWithProxy(requestUrl) {
  try {
    const result = await fetch(PROXY_URL + requestUrl);
    console.log(result);
    const proxyData = await result.json();
    const data = JSON.parse(proxyData.contents);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getParkingInfoByStreet(streetName) {
  const request = encodeURIComponent(
    `${API_URL}//ptillaten/street/${streetName}?outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

export async function getParkingInfoByCoords(latitude, longitude, radius = 50) {
  const request = encodeURIComponent(
    `${API_URL}/ptillaten/within?radius=${radius}&lat=${latitude}&lng=${longitude}&outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}
