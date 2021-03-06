import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../Contexts/userContext';
import { API_URL } from '../../Routers/routers';
import { getUserToken } from '../../Utils/Auth';
import { fetchMeStuff } from '../../Utils/functions';
import InputText from '../InputText';
// import InputTextarea from '../InputTextarea';
import SalarySlider from '../SalarySlider';
import Tag from '../Tag';
import styles from './offerForm.module.css';

const OfferForm = ({ handleClose, handleOfferCreated, offerId }) => {
  const [skillData, setSkillData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [offerData, setOfferData] = useState({
    title: '',
    salary: '40000',
    city: '',
    position: '',
    skills: [],
    description: '',
    companyInfo: '',
  });

  const { userInfo } = useContext(UserContext);

  const authObject = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserToken()}`,
    },
  };

  useEffect(() => {
    if (offerId) {
      fetchMeStuff(`${API_URL}/offer/${offerId}/raw`, authObject, (o) =>
        setOfferData({
          title: o.title,
          salary: o.salary,
          position: o.position[0],
          skills: o.skills,
          description: o.description,
        })
      );
    }
    fetchMeStuff(`${API_URL}/skill`, authObject, setSkillData);
    fetchMeStuff(`${API_URL}/position`, authObject, setPositionData);
    setOfferData({ ...offerData, companyInfo: userInfo._id });
  }, []);

  const addSkill = (skillId) => {
    if (offerData.skills.includes(skillId)) {
      setOfferData({ ...offerData, skills: [...offerData.skills.filter((s) => s !== skillId)] });
    } else {
      setOfferData({ ...offerData, skills: [...offerData.skills, skillId] });
    }
  };

  const addPosition = (positionId) => {
    if (offerData.position === positionId) {
      setOfferData({ ...offerData, position: '' });
    } else {
      setOfferData({ ...offerData, position: positionId });
    }
  };

  const handleSubmit = () => {
    const options = {
      method: 'POST',
      headers: new Headers({
        Accept: 'apllication/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${getUserToken()}`,
      }),
      mode: 'cors',
      body: JSON.stringify(offerData),
    };

    fetchMeStuff(`${API_URL}/offer`, options, handleOfferCreated);
  };

  const handleEdit = () => {
    const options = {
      method: 'PUT',
      headers: new Headers({
        Accept: 'apllication/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${getUserToken()}`,
      }),
      mode: 'cors',
      body: JSON.stringify(offerData),
    };

    fetchMeStuff(`${API_URL}/offer/${offerId}`, options, handleOfferCreated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        {!offerId && <p className={styles.mainTitle}>Create a new offer</p>}
        {offerId && <p className={styles.mainTitle}>Edit offer</p>}
        <InputText
          labelText="Offer title"
          value={offerData.title}
          width="20vw"
          handleOnChange={(text) => setOfferData({ ...offerData, title: text })}
        />
        <InputText
          labelText="Offer description"
          value={offerData.description}
          width="30vw"
          handleOnChange={(des) => setOfferData({ ...offerData, description: des })}
        />
      </div>

      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>Annual salary</p>
        <p className={styles.formSectionSubtitle}>Candidates will not see this amount</p>
        <SalarySlider
          style={{ width: '20vw' }}
          value={offerData.salary}
          onChange={(s) => setOfferData({ ...offerData, salary: s })}
        />
      </div>
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>Position of the offer</p>
        <p className={styles.formSectionSubtitle}>Choose one from the list</p>
        <div className={styles.tagContainer}>
          {positionData &&
            positionData.map((item) => (
              <Tag
                name={item.name}
                onClick={addPosition}
                value={item._id}
                isActive={offerData.position === item._id}
              />
            ))}
        </div>
      </div>
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>Skills required</p>
        <p className={styles.formSectionSubtitle}>Choose all that apply</p>
        <div className={styles.tagContainer}>
          {skillData &&
            skillData.map((item) => (
              <Tag
                name={item.skill}
                onClick={addSkill}
                value={item._id}
                isActive={offerData.skills.includes(item._id)}
              />
            ))}
        </div>
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.button} type="button" onClick={handleClose}>
          Cancel
        </button>
        {!offerId ? (
          <button
            className={`${styles.button} ${styles.actionButton}`}
            type="button"
            onClick={handleSubmit}
          >
            Create
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.actionButton}`}
            type="button"
            onClick={handleEdit}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferForm;
