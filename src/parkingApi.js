const PROXY_URL = 'https://api.allorigins.win/get?url=';
const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1';
const API_KEY = process.env.REACT_APP_PARKING_API_KEY;

async function fetchJsonWithProxy(requestUrl) {
  try {
    const result = await fetch(PROXY_URL + requestUrl);
    const proxyData = await result.json();
    const data = JSON.parse(proxyData.contents);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSpacesByStreet(streetName) {
  const request = encodeURIComponent(
    `${API_URL}//ptillaten/street/${streetName}?outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

export async function getSpacesByCoords(latitude, longitude, radius = 50) {
  const request = encodeURIComponent(
    `${API_URL}/ptillaten/within?radius=${radius}&lat=${latitude}&lng=${longitude}&outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

export async function getServiceInfoByCoords(latitude, longitude, radius = 50) {
  const request = encodeURIComponent(
    `${API_URL}/servicedagar/within?radius=${radius}&lat=${latitude}&lng=${longitude}&outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

function isAllowed(spot, serviceInfo) {
  const WEEKDAYS = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  const isRegulated = spot.VF_PLATS_TYP.contains('Tidsreglerad');
  const isReserved = spot.VF_PLATS_TYP.contains('Reserverad');
  if (Object.keys(serviceInfo).length) {
    const now = new Date();
    if (WEEKDAYS[now.getDay()] === serviceInfo.START_WEEKDAY) {
      const currTimeWonkyFormat = 100 * now.getHours() + now;
    }
  }
  if (isRegulated) return [false, 'Regulerad lastplats'];
  if (isReserved) return [false, 'Ditt fordon får ej parkera här'];
  return [true, ''];
}
