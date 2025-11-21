// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import QuestionForm from "../components/QuestionForm";
import ConfirmPage from "../components/ConfirmPage";
import ThankYouPage from "../components/ThankYouPage";
import styles from "../styles/Form.module.css";

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

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [preface, setPreface] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"form" | "confirm" | "thankyou">("form");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_GAS_URL as string)
      .then(res => res.json())
      .then((data: QuestionsResponse) => {
      setTitle(data.title);
      setPreface(data.preface);
      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
          setQuestions([]); // 安全策
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleConfirm = (ans: Record<string, string>) => {
    setAnswers(ans);
    setStep("confirm");
  };

  const handleSubmit = async () => {
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
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className={styles.container}>
      {/* タイトルと前書きは「フォーム画面」のときだけ表示 */}
      {step === "form" && (
        <>
          <h1 className={styles.title}>{title || "アンケートフォーム"}</h1>
          {preface && (
            <div className={styles.preface}>
              <hr />
              <p>{preface}</p>
              <hr />
            </div>
          )}
        </>
      )}

      {step === "form" && (
        <QuestionForm
          questions={questions}
          onConfirm={handleConfirm}
          message={message}
          answers={answers} // ← 戻ったときに入力保持
        />
      )}
      {step === "confirm" && (
        <ConfirmPage
          title={title}
          questions={questions}
          answers={answers}
          onBack={() => setStep("form")}
          onSubmit={handleSubmit}
        />
      )}
      {step === "thankyou" && <ThankYouPage title={title} />}
    </div>
  );
}
