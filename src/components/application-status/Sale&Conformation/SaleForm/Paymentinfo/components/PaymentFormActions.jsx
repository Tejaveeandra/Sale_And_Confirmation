import React from 'react';
import Button from '../../../../../../widgets/Button/Button';
import { ReactComponent as TrendingUpIcon } from '../../../../../../assets/application-status/Trending up.svg';
import styles from './PaymentFormActions.module.css';

const PaymentFormActions = ({ onSubmit, values, isSubmitting, buttonText = "Finish Sale" }) => {
  return (
    <div className={styles.form_actions}>
      <Button
        buttonname={buttonText}
        righticon={<TrendingUpIcon />}
        onClick={() => onSubmit(values)}
        variant="primary"
        width="auto"
        type="submit"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default PaymentFormActions;
