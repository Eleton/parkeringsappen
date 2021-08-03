const PROXY_URL = 'https://api.allorigins.win/get?url=';
const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/street';
const API_KEY = process.env.REACT_APP_PARKING_API_KEY;

export async function getParkingInfoByStreet(streetName) {
  const request = encodeURIComponent(
    `${API_URL}/${streetName}?outputFormat=json&apiKey=${API_KEY}`
  );
  try {
    const result = await fetch(PROXY_URL + request);
    console.log(result);
    const proxyData = await result.json();
    const data = JSON.parse(proxyData.contents);
    return data.features;
  } catch (error) {
    console.error(error);
    return [];
  }
}
