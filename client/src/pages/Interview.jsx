import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Interview() {
  const location = useLocation();
  const category = location.state?.category;

  const questionBank = {
    Frontend: ["What is React?", "What is JSX?", "Explain useState"],
    Backend: ["What is Node.js?", "What is Express?", "What is middleware"],
    DSA: ["What is array?", "Explain linked list", "What is binary search"],
    HR: ["Tell me about yourself", "Why should we hire you?", "Strengths?"],
    Java: ["What is JVM?", "Explain OOP", "What is inheritance?"],
    "MERN Stack": ["What is MongoDB?", "What is REST API?", "What is JWT?"],
  };

  const questions = questionBank[category] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const saveInterviewResult = async (finalAnswers, finalScore) => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          score: finalScore,
          answers: finalAnswers,
        }),
      });
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  const handleNext = () => {
    const newAnswer = {
      question: questions[currentQuestion],
      answer,
    };

    const updatedAnswers = [...answers, newAnswer];
    let updatedScore = score;

    if (answer.trim()) {
      updatedScore += 10;
    }

    setAnswers(updatedAnswers);
    setScore(updatedScore);
    setAnswer("");
    setTimeLeft(30);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsFinished(true);
      saveInterviewResult(updatedAnswers, updatedScore);
    }
  };

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, currentQuestion, answers, score, answer]);

  if (!category) {
    return <h2>No category selected</h2>;
  }

  if (isFinished) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Interview Completed 🎉</h1>
        <h2>Score: {score}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{category} Interview</h1>
      <h3>Time Left: {timeLeft}</h3>

      <h2>Question {currentQuestion + 1}</h2>
      <p>{questions[currentQuestion]}</p>

      <textarea
        rows="6"
        cols="50"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br /><br />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Interview;