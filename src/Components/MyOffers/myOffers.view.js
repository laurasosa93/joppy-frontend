import React, { useState, useEffect } from 'react';
import { getUserToken, getSessionUser } from '../../Utils/Auth';
import styles from './myOffers.module.css';
import AcceptedOffer from '../AcceptedOffer';
import Loader from '../Loader';
import { API_URL } from '../../Routers/routers';

const MyOffers = ({ userData }) => {
  const [offers, setOffers] = useState();
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const refresh = () => {
    setTriggerRefresh(!triggerRefresh);
  };

  useEffect(() => {
    if (getUserToken() && getSessionUser()) {
      const options = {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${getUserToken()}`,
        }),
        mode: 'cors',
        body: JSON.stringify({ userId: userData._id }),
      };
      fetch(`${API_URL}/offerstatus/acceptedoffers`, options)
        .then((res) => res.json())
        .then((data) => {
          setOffers(data);
          console.log(offers);
        })
        .catch();
    }
  }, [triggerRefresh]);

  return (
    <div className={styles.myOffers}>
      {offers === undefined || offers.length < 1 ? (
        <p>You have no accepted offers. Go back to the offers page to find your ideal job!</p>
      ) : (
        <p>Take a look at the offers you are interested in and start contacting the companies!</p>
      )}
      <div className={styles.chat}>
        {offers ? (
          offers.map((offer) => (
            <AcceptedOffer offer={offer} userData={userData} refresh={refresh} />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default MyOffers;
