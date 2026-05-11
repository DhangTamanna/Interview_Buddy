import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

function Interview() {
  const location = useLocation();
  const category = location.state?.category;

  const questionBank = {
    Frontend: [
      "What is React?",
      "What is JSX?",
      "Explain useState",
    ],
    Backend: [
      "What is Node.js?",
      "What is Express?",
      "What is middleware?",
    ],
    DSA: [
      "What is array?",
      "Explain linked list",
      "What is binary search?",
    ],
    HR: [
      "Tell me about yourself",
      "Why should we hire you?",
      "What are your strengths?",
    ],
    Java: [
      "What is JVM?",
      "Explain OOP concepts",
      "What is inheritance?",
    ],
    "MERN Stack": [
      "What is MongoDB?",
      "Explain REST API",
      "What is JWT?",
    ],
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
      const token = localStorage.getItem("token") || "";
      const response = await fetch("http://localhost:5000/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          score: finalScore,
          answers: finalAnswers,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = useCallback(() => {
    const newAnswer = {
      question: questions[currentQuestion],
      answer: answer,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    let updatedScore = score;
    if (answer.trim() !== "") {
      updatedScore = score + 10;
      setScore(updatedScore);
    }

    setAnswer("");
    setTimeLeft(30);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveInterviewResult(updatedAnswers, updatedScore);
      setIsFinished(true);
    }
  }, [currentQuestion, answer, answers, score, questions]);

  useEffect(() => {
    if (isFinished) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isFinished, handleNext]);

  if (isFinished) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Interview Completed 🎉</h1>
        <h2>Your Score: {score}</h2>
        <h3>Interview Summary</h3>
        {answers.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <p><strong>Question:</strong> {item.question}</p>
            <p><strong>Your Answer:</strong> {item.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{category} Interview</h1>
      <h3>Time Left: {timeLeft} seconds</h3>
      <h2>Question {currentQuestion + 1}</h2>
      <p>{questions[currentQuestion]}</p>
      <textarea
        rows="6"
        cols="50"
        placeholder="Write your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleNext}>Next Question</button>
    </div>
  );
}

export default Interview;