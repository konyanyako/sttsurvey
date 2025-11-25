import styles from "../styles/Form.module.css";

type Question = {
  id: string;
  text: string;
  type: string;
  options: string[];
  required: boolean;
};

export default function QuestionItem({
  question,
  value,
}: {
  question: Question;
  value?: string;
}) {
  const { id, text, type, options, required } = question;

  return (
    <div className={styles.question}>
      <label className={styles.label}>
        {text}{required && <span className={styles.required}> *</span>}
      </label>
      <div className={styles.inputArea}>
        {type === "text" && (
          <input name={id} defaultValue={value} required={required} />
        )}
        {type === "email" && (
          <input type="email" name={id} defaultValue={value} required={required} />
        )}
        {type === "textarea" && (
          <textarea name={id} defaultValue={value} required={required}></textarea>
        )}
        {type === "radio" &&
          options.map(opt => (
            <label key={opt} className={styles.option}>
              <input
                type="radio"
                name={id}
                value={opt}
                defaultChecked={value === opt}
                required={required}
              />
              {opt}
            </label>
          ))}
        {type === "checkbox" &&
          options.map(opt => (
            <label key={opt} className={styles.option}>
              <input
                type="checkbox"
                name={id}
                value={opt}
                defaultChecked={
                  value ? value.split(",").indexOf(opt) !== -1 : false
                }
              />
              {opt}
            </label>
          ))}
        {type === "select" && (
          <select name={id} defaultValue={value} required={required}>
            <option value="">選択してください</option>
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
