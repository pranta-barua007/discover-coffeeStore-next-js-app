const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `${process.env.FOURSQUARE_API_KEY}`,
  },
};

const getPlacesUrl = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const fetchCoffeeStores = async () => {
  const response = await fetch(
    getPlacesUrl("coffee shop", "43.65267326999575,-79.39545615725015", 6),
    options
  );
  const data = await response.json();

  return data.results;
};

const getImagesUrl = (fsq_id, limit) => {
  return `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=${limit}`;
};
const fetchPlacesImages = async (fsq_id) => {
  const response = await fetch(getImagesUrl(fsq_id, 1), options);
  const data = await response.json();

  return data[0];
};

export const fetchCoffeeShopsData = async () => {
  const data = [];
  const coffeeStores = await fetchCoffeeStores();

  for await (const store of coffeeStores) {
    const imgData = await fetchPlacesImages(store.fsq_id);
    data.push({ imgData, ...store });
  }

  return data;
};
