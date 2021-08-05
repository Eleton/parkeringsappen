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

export async function getSpacesByCoords(latitude, longitude, radius = 250) {
  const request = encodeURIComponent(
    `${API_URL}/ptillaten/within?radius=${radius}&lat=${latitude}&lng=${longitude}&outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

export async function getServiceInfoByCoords(latitude, longitude, radius = 250) {
  const request = encodeURIComponent(
    `${API_URL}/servicedagar/within?radius=${radius}&lat=${latitude}&lng=${longitude}&outputFormat=json&apiKey=${API_KEY}`
  );
  return await fetchJsonWithProxy(request);
}

function before(time, comparison) {
  if (time[0] < comparison[0]) {
    return true;
  } else {
    return time[0] === comparison[0] && time[1] <= comparison[1];
  }
}

function after(time, comparison) {
  if (time[0] > comparison[0]) {
    return true;
  } else {
    return time[0] === comparison[0] && time[1] >= comparison[1];
  }
}

function distanceToOrigin(feature, lat, lng) {
  const [fLng, fLat] = feature.geometry.coordinates[0];
  return (lng - fLng) ** 2 + (lat - fLat) ** 2;
}

function cyclicBetween(time, start, end) {
  if (before(end, start)) {
    return before(time, end) || after(time, start);
  } else {
    return before(time, end) && after(time, start);
  }
}

function isAllowed(spot, serviceInfo) {
  const WEEKDAYS = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  const isRegulated = spot.VF_PLATS_TYP.includes('Tidsreglerad');
  const isReserved = spot.VF_PLATS_TYP.includes('Reserverad');
  console.log(serviceInfo);
  if (Object.keys(serviceInfo).length) {
    const { START_WEEKDAY, START_TIME, END_TIME, START_MONTH, END_MONTH, START_DAY, END_DAY } =
      serviceInfo;
    const now = new Date();
    if (WEEKDAYS[now.getDay()] === START_WEEKDAY) {
      const startTime = [Math.floor(START_TIME / 100), START_TIME % 100];
      const endTime = [Math.floor(END_TIME / 100), END_TIME % 100];
      if (cyclicBetween([now.getHours(), now.getMinutes()], startTime, endTime)) {
        if (!START_MONTH) return [false, 'Servicetid'];
        // getMonth indexes from 0...
        if (
          cyclicBetween(
            [now.getMonth() + 1, now.getDate()],
            [START_MONTH, START_DAY],
            [END_MONTH, END_DAY]
          )
        )
          return [false, 'Servicetid'];
      }
    }
  }
  if (isRegulated) return [false, 'Regulerad lastplats'];
  if (isReserved) return [false, 'Ditt fordon får ej parkera här'];
  return [true, ''];
}

function getAllowedFeatures(spotList, serviceInfoList) {
  const allowedFeatures = [];
  const distinctAddresses = new Set();

  for (let spot of spotList) {
    let { FEATURE_OBJECT_ID: id, ADDRESS: address } = spot.properties;
    let serviceInfo = serviceInfoList.find((sInfo) => sInfo.properties.FEATURE_OBJECT_ID === id);
    if (!serviceInfo) continue;
    if (distinctAddresses.has(address)) continue;
    [spot.properties.PARKING_ALLOWED, spot.properties.PARKING_DISALLOWED_REASON] = isAllowed(
      spot.properties,
      serviceInfo
    );
    allowedFeatures.push(spot);
    distinctAddresses.add(address);
  }
  return allowedFeatures;
}

function getSortedProperties(allowedSpots, lat, lng) {
  return allowedSpots
    .map((spot) => ({ ...spot, DISTANCE_TO_ORIGIN: distanceToOrigin(spot, lat, lng) }))
    .sort((spot1, spot2) => spot1.DISTANCE_TO_ORIGIN - spot2.DISTANCE_TO_ORIGIN)
    .map(({ properties, geometry, DISTANCE_TO_ORIGIN }) => ({
      ...properties,
      COORDINATES: geometry.coordinates,
      DISTANCE_TO_ORIGIN,
    }));
}

async function forAimanToImplement(lat, lng) {
  const spaces = await getSpacesByCoords(lat, lng);
  const serviceInfo = await getServiceInfoByCoords(lat, lng);
  console.log({ spaces, serviceInfo });
  const allowed = getAllowedFeatures(spaces.features, serviceInfo.features);
  const sortedAllowed = getSortedProperties(allowed, lat, lng);
  return sortedAllowed;
}

export default forAimanToImplement;
