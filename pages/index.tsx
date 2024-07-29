import { useRouter } from 'next/router';
import { useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleContinue = () => {
    router.push('/onboarding');
  };

  const createBubbleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    for (let i = 0; i < 5; i++) {
      const bubble = document.createElement('div');
      bubble.className = styles.bubbleEffect;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = '0';
      button.appendChild(bubble);

      bubble.addEventListener('animationend', () => {
        bubble.remove();
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeText}>Welcome to Playlystify</h1>
      <button
        className={styles.continueButton}
        onClick={handleContinue}
        onMouseEnter={createBubbleEffect}
        ref={buttonRef}
      >
        Continue
      </button>
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
