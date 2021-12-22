import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeShopsData } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/coffee-store.context";
import { isEmpty } from "../../utils";

import styles from "../../styles/coffee-store.module.css";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeShopsData();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeShopsData();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.fsq_id.toString() },
    };
  });
  return {
    paths: paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading....</div>;
  }
  const id = router.query.id;
  
  const { name, location, imgUrl } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log("Handle upvote");
  };

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStoreData) => {
    const { fsq_id, name, imgUrl, location } = coffeeStoreData;
    try {
      const response = await fetch('/api/createCoffeeStore', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fsq_id,
          name,
          voting: 0,
          neighborhood: Array.isArray(location?.neighborhood) ? location?.neighborhood[0] : location?.neighborhood || "",
          address: location?.address || "",
          imgUrl
        })
      });
      const dbCoffeeStore = await response.json();
      console.log(dbCoffeeStore);
    }catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === id;
        });

        if(findCoffeeStoreFromContext) {
          setCoffeeStore(findCoffeeStoreFromContext);
          handleCreateCoffeeStore(findCoffeeStoreFromContext);
        }
      }
    }else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            alt={name}
            width={600}
            height={300}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {location?.address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width="24" height="24" />
              <p className={styles.text}>{location.address}</p>
            </div>
          )}
          {location?.neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" />
              <p className={styles.text}>{location.neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
