const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1/ptillaten/street';
const API_KEY = process.env.REACT_APP_PARKING_API_KEY;

export async function getParkingInfo(streetName) {
  try {
    const result = await fetch(`${API_URL}/${streetName}?outputFormat=json&apiKey=${API_KEY}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
    const data = await result.json();
    return data.features;
  } catch (error) {
    console.error(error);
    return [];
  }
}
