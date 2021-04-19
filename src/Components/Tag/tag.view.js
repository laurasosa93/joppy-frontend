import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './tag.module.css';

const Tag = ({ name, icon, match, value, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <div className={styles.tagContainer} onClick={handleClick}>
      {icon && (
        <span className={styles.tagIcon}>
          <FontAwesomeIcon icon={icon} />
        </span>
      )}

      <div className={styles.tagChildren}>{name}</div>

      {match && (
        <span className={styles.tagCheck}>
          <FontAwesomeIcon icon="check" />
        </span>
      )}
    </div>
  );
};

export default Tag;
