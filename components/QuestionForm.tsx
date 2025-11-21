// components/QuestionForm.tsx 
"use client";

import { FormEvent, useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import styles from "../styles/Form.module.css";

type Question = {
  id: string;
  text: string;
  type: string;
  options: string[];
  required: boolean;
};

export default function QuestionForm({
  questions,
  onConfirm,
  message,
  answers,
}: {
  questions: Question[];
  onConfirm: (answers: Record<string, string>) => void;
  message: string | null;
  answers: Record<string, string>;
}) {
  const [formValid, setFormValid] = useState(false);

  // 初期表示や answers が変わったときに必須チェック
  useEffect(() => {
    let valid = true;
    questions.forEach(q => {
      if (q.required) {
        const v = answers[q.id];
        if (!v || v.trim() === "") {
          valid = false;
        }
      }
    });
    setFormValid(valid);
  }, [questions, answers]);

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    let valid = true;
    questions.forEach(q => {
      if (q.required) {
        const v = formData.getAll(q.id);
        if (v.length === 0 || v.every(val => String(val).trim() === "")) {
          valid = false;
        }
      }
    });
    setFormValid(valid);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAnswers: Record<string, string> = {};
    questions.forEach(q => {
      if (q.type === "checkbox") {
        const values = formData.getAll(q.id).map(v => String(v));
        newAnswers[q.id] = values.join(",");
      } else {
        const v = formData.get(q.id);
        newAnswers[q.id] = v ? String(v) : "";
      }
    });
    onConfirm(newAnswers);
  };

  return (
    <form onSubmit={handleSubmit} onChange={handleChange}>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {questions.map(q => (
        <QuestionItem key={q.id} question={q} value={answers[q.id]} />
      ))}
      <button className={styles.button} type="submit" disabled={!formValid}>
        内容を確認する
      </button>
    </form>
  );
}
