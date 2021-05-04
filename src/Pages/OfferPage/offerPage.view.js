import React, { useEffect, useState } from 'react';
import ButtonsBar from '../../Components/ButtonsBar';
import styles from './offerPage.module.css';
import JobOffer from '../../Components/JobOffer';
import { ReactComponent as Plant } from '../../Images/plant.svg';
import { getSessionUser, getUserToken } from '../../Utils/Auth';

const OfferPage = () => {
  const [offerArray, setOfferArray] = useState();
  const [count, setCount] = useState(0);
  const userSession = getSessionUser();
  const userToken = getUserToken();
  let url;
  const authObject = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  };

  const nextOffer = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    fetch('http://localhost:3001/offer', authObject)
      .then((res) => res.json())
      .then((data) => setOfferArray(data))
      .catch();
  }, []);

  if (offerArray) {
    url = `http://localhost:3001/offer/${offerArray[count]._id}`;
  }

  const updateOffer = (body) => {
    const options = {
      method: 'PUT',
      headers: new Headers({
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      }),
      mode: 'cors',
      body: JSON.stringify(body),
    };
    fetch(url, options, body)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject();
      })
      .then((data) => {
        console.log(data);
      })
      .catch();
  };

  const handleReject = () => {
    const body = {
      rejected: userSession.id,
    };
    updateOffer(body);
    nextOffer();
  };

  const handleAccept = () => {
    const body = {
      accepted: userSession.id,
    };
    updateOffer(body);
    nextOffer();
  };

  return (
    <div className={styles.offerPage}>
      <div className={styles.offerBody}>
        {offerArray && count < offerArray.length ? (
          <JobOffer offerInfo={offerArray[count]._id} />
        ) : (
          <p>Nothing to show</p>
        )}
      </div>
      <ButtonsBar
        rejectClicked={handleReject}
        acceptClicked={handleAccept}
        nextClicked={nextOffer}
      />
      <Plant className={styles.plant} />
    </div>
  );
};

export default OfferPage;
