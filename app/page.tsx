// app/page.tsx
import QuestionForm from "../components/QuestionForm";
import ConfirmPage from "../components/ConfirmPage";
import ThankYouPage from "../components/ThankYouPage";
import styles from "../styles/Form.module.css";
"use client";

import { useState } from "react";

type Question = {
  id: string;
  text: string;
  type: string;
  options: string[];
  required: boolean;
};

type QuestionsResponse = {
  title: string;
  preface: string;
  questions: Question[];
};

// SSRで初期データを取得
export async function getServerSideProps() {
  let data: QuestionsResponse = {
    title: "アンケートフォーム",
    preface: "",
    questions: [],
  };

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL as string);
    data = await res.json();
  } catch (err) {
    console.error("データ取得エラー:", err);
  }

  return { props: { data } };
}

export default function Home({ data }: { data: QuestionsResponse }) {
  const [step, setStep] = useState<"form" | "confirm" | "thankyou">("form");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleConfirm = (ans: Record<string, string>) => {
    setAnswers(ans);
    setStep("confirm");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL as string, {
        method: "POST",
        body: JSON.stringify(answers),
      });
      const result = await res.json();
      if (result.ok) {
        setStep("thankyou");
      } else {
        setMessage("エラー: " + result.message);
        setStep("form");
      }
    } catch (err: any) {
      setMessage("送信エラー: " + err.message);
      setStep("form");
    }
  };

  // フォールバック: JSが動かない環境用のシンプルHTMLフォーム
  const FallbackForm = () => (
    <form action={process.env.NEXT_PUBLIC_GAS_URL} method="post">
      <h1>{data.title || "アンケートフォーム"}</h1>
      {data.preface && <p>{data.preface}</p>}
      {data.questions.map(q => (
        <div key={q.id}>
          <label>
            {q.text} {q.required && "*"}
          </label>
          {q.type === "text" && <input name={q.id} />}
          {q.type === "email" && <input type="email" name={q.id} />}
          {q.type === "textarea" && <textarea name={q.id}></textarea>}
          {q.type === "radio" &&
            q.options.map(opt => (
              <label key={opt}>
                <input type="radio" name={q.id} value={opt} /> {opt}
              </label>
            ))}
          {q.type === "checkbox" &&
            q.options.map(opt => (
              <label key={opt}>
                <input type="checkbox" name={q.id} value={opt} /> {opt}
              </label>
            ))}
          {q.type === "select" && (
            <select name={q.id}>
              <option value="">選択してください</option>
              {q.options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button type="submit">送信</button>
    </form>
  );

  return (
    <div className={styles.container}>
      {/* JSが動かない環境でも最低限表示されるようにフォールバックを用意 */}
      <noscript>
        <FallbackForm />
      </noscript>

      {step === "form" && (
        <>
          <h1 className={styles.title}>{data.title}</h1>
          {data.preface && (
            <div className={styles.preface}>
              <hr />
              <p>{data.preface}</p>
              <hr />
            </div>
          )}
          <QuestionForm
            questions={data.questions}
            onConfirm={handleConfirm}
            message={message}
            answers={answers}
          />
        </>
      )}
      {step === "confirm" && (
        <ConfirmPage
          title={data.title}
          questions={data.questions}
          answers={answers}
          onBack={() => setStep("form")}
          onSubmit={handleSubmit}
        />
      )}
      {step === "thankyou" && <ThankYouPage title={data.title} />}
    </div>
  );
}
