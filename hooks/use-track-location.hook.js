import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/coffee-store.context";

const useTrackLocation = () => {
  const [locationErrMsg, setLocationErrMsg] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const {dispatch} = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: {latLong: `${latitude},${longitude}`}
    })
    setLocationErrMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrMsg("Unable to retrive location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      // status.textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    locationErrMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
