// components/ThankYouPage.tsx
import styles from "../styles/Form.module.css";

export default function ThankYouPage({ title }: { title: string }) {
  return (
    <div className={styles.thankyou}>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>ご回答ありがとうございました。</h2>
      <p>アンケートへのご協力に感謝いたします。</p>
    </div>
  );
}
