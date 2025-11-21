// components/ConfirmPage.tsx
import styles from "../styles/Form.module.css";

type Question = {
  id: string;
  text: string;
  type: string;
  options: string[];
  required: boolean;
};

export default function ConfirmPage({
  title,
  questions,
  answers,
  onBack,
  onSubmit,
}: {
  title: string;
  questions: Question[];
  answers: Record<string, string>;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className={styles.confirm}>
      {/* タイトルを表示 */}
      <h1 className={styles.title}>{title}</h1>

      <h2 className={styles.subtitle}>回答内容の確認</h2>
      <ul className={styles.answerList}>
        {questions.map(q => (
          <li key={q.id} className={styles.answerItem}>
            <strong>{q.text}</strong><br />
            {answers[q.id] || "(未回答)"}
          </li>
        ))}
      </ul>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={onSubmit}>回答を提出する</button>
        <button className={styles.button} onClick={onBack} className={styles.secondaryButton}>
          回答を修正する
        </button>
      </div>
    </div>
  );
}
