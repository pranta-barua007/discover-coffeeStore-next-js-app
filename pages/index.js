import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { fetchCoffeeShopsData } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location.hook";
import { ACTION_TYPES, StoreContext } from "../store/coffee-store.context";

import Banner from "../components/banner/banner";
import Card from "../components/card/card";

export async function getStaticProps(context) {
  const data = await fetchCoffeeShopsData();

  return {
    props: { coffeeStores: data }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrMsg, isFindingLocation  } = useTrackLocation();
  const [nearbyShopsErr, setNearbyShopsErr] = useState('');

  const { dispatch, state } = useContext(StoreContext);

  const { latLong, coffeeStores } = state;

  useEffect(() => {
    if(latLong) {
      try {
        const fetchedCoffeeStores = async () => {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=9`);
          const fetchedData = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {coffeeStores: fetchedData}
          });
          setNearbyShopsErr('');
        }

        fetchedCoffeeStores();
      }catch(err) {
        console.error(err);
        setNearbyShopsErr(err.message);
      }
    }
  }, [latLong, dispatch]);

  const handleBannerBtnOnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Loading..." : "View Coffee shop nearby"}
          handleOnClick={handleBannerBtnOnClick}
        />
        {locationErrMsg && <p>Something went wrong: {locationErrMsg}</p>}
        {nearbyShopsErr && <p>Something went wrong: {nearbyShopsErr}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero-image"
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Nearby stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                const { fsq_id, name, imgUrl } = coffeeStore;
                return (
                <Card
                  key={fsq_id}
                  className={styles.card}
                  name={name}
                  imgUrl={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                  href={`/coffee-store/${fsq_id}`}
                />
              )})}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                const { fsq_id, name, imgUrl } = coffeeStore;

                return (
                <Card
                  key={fsq_id}
                  className={styles.card}
                  name={name}
                  imgUrl={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                  href={`/coffee-store/${fsq_id}`}
                />
              )})}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
