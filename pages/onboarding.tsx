import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.email.trim() !== '';
      case 3:
        return formData.date.trim() !== '';
      case 4:
        return formData.time.trim() !== '';
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Calendar invite sent');
        } else {
          alert('Failed to create event: ' + data.error);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.onboardingFormContainer}>
        <div className={styles.arrows}>
          {step > 1 && (
            <div className={styles.arrow} onClick={handlePrevious}>
              &#8592;
            </div>
          )}
          <div className={styles.arrow}>&nbsp;</div>
          {step < 4 && (
            <div className={styles.arrow} onClick={handleNext}>
              &#8594;
            </div>
          )}
        </div>
        <form className={styles.onboardingForm} onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className={styles.questionText}>What is your name?</div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.questionText}>What is your email?</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </>
          )}
          {step === 3 && (
            <>
              <div className={styles.questionText}>What is the date?</div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </>
          )}
          {step === 4 && (
            <>
              <div className={styles.questionText}>What is the time?</div>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit</button>
            </>
          )}
        </form>
      </div>
      <div className={styles.bubbles}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>
    </div>
  );
}
