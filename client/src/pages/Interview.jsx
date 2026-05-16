
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Interview() {

  const location = useLocation();

  const category = location.state?.category;

  const questions = location.state?.questions || [];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(120);

  const [answer, setAnswer] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [isFinished, setIsFinished] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [aiFeedback, setAiFeedback] =
    useState(null);

  const [showFeedback, setShowFeedback] =
    useState(false);

  // ✅ ADDED
  const [isListening, setIsListening] =
    useState(false);


  // ================= SAVE RESULT =================

  const saveInterviewResult = async (
    finalAnswers,
    finalScore
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        "http://localhost:5000/save-result",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            category,
            score: finalScore,
            answers: finalAnswers,
          }),
        }
      );

    } catch (error) {

      console.log(
        "Save error:",
        error
      );
    }
  };


  // ================= SPEECH RECOGNITION =================

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      return alert(
        "Speech Recognition is not supported in this browser."
      );
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      setAnswer((prev) =>
        prev + " " + transcript
      );
    };

    recognition.onerror = () => {

      setIsListening(false);
    };

    recognition.onend = () => {

      setIsListening(false);
    };
  };


  // ================= AI EVALUATION =================

  const evaluateAnswer = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/evaluate-answer",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            question:
              questions[currentQuestion],

            answer,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "AI RESPONSE:",
        data
      );

      return {
        score:
          parseInt(data.score) || 0,

        feedback:
          data.feedback ||
          "No feedback generated.",
      };

    } catch (error) {

      console.log(
        "AI Evaluation Error:",
        error
      );

      return {
        score: 0,
        feedback:
          "AI evaluation failed.",
      };

    } finally {

      setLoading(false);
    }
  };


  // ================= SUBMIT ANSWER =================

  const handleSubmitAnswer = async () => {

    if (loading) return;

    let aiResult = {
      score: 0,
      feedback: "",
    };

    if (answer.trim()) {

      aiResult =
        await evaluateAnswer();
    }

    setAiFeedback(aiResult);

    setShowFeedback(true);

    const newAnswer = {

      question:
        questions[currentQuestion],

      answer,

      feedback:
        aiResult.feedback,

      aiScore:
        aiResult.score,
    };

    const updatedAnswers = [
      ...answers,
      newAnswer,
    ];

    const updatedScore =
      score + aiResult.score;

    setAnswers(updatedAnswers);

    setScore(updatedScore);
  };


  // ================= NEXT QUESTION =================

  const handleNextQuestion = () => {

    setAnswer("");

    setAiFeedback(null);

    setShowFeedback(false);

    setTimeLeft(120);

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        (prev) => prev + 1
      );

    } else {

      setIsFinished(true);

      saveInterviewResult(
        answers,
        score
      );
    }
  };


  // ================= TIMER =================

  useEffect(() => {

    if (
      isFinished ||
      loading ||
      showFeedback
    ) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          handleSubmitAnswer();

          return 120;
        }

        return prev - 1;
      });

    }, 1000);

    return () =>
      clearInterval(timer);

  }, [
    currentQuestion,
    isFinished,
    loading,
    showFeedback,
  ]);


  // ================= EMPTY STATE =================

  if (
    !category ||
    !questions.length
  ) {

    return (

      <div className="text-white p-10">

        <h2>
          No interview data found.
          Please start again.
        </h2>

      </div>
    );
  }


  // ================= FINISHED =================

  if (isFinished) {

    return (

      <div className="flex items-center justify-center min-h-[70vh]">

        <div className="bg-gray-900 border border-gray-800 p-10 rounded-xl text-center space-y-4">

          <h1 className="text-3xl font-bold text-green-400">

            Interview Completed 🎉

          </h1>

          <p className="text-gray-400">

            AI Evaluation Finished

          </p>

          <div className="text-2xl font-semibold text-white">

            Final Score:

            <span className="text-blue-400">

              {" "}
              {score}/{questions.length * 10}

            </span>

          </div>

        </div>

      </div>
    );
  }


  const progress =
    ((currentQuestion + 1) /
      questions.length) * 100;


  // ================= MAIN UI =================

  return (

    <div className="flex justify-center items-center min-h-[80vh] text-white">

      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-xl font-bold text-blue-400">

            {category} Interview

          </h1>

          <div className="text-sm bg-gray-800 px-3 py-1 rounded-full">

            ⏱️ {timeLeft}s

          </div>

        </div>


        {/* PROGRESS */}
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">

          <div
            className="bg-blue-500 h-full transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        <p className="text-sm text-gray-400">

          Question {currentQuestion + 1}
          {" "}of{" "}
          {questions.length}

        </p>


        {/* QUESTION */}
        <div className="bg-gray-800 p-4 rounded-lg">

          <h2 className="text-lg font-semibold text-white">

            {questions[currentQuestion]}

          </h2>

        </div>


        {/* ANSWER */}
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          rows="6"
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Write your answer here..."
          disabled={showFeedback}
        />


        {/* ✅ MIC BUTTON */}
        {!showFeedback && (

          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
          >

            {isListening
              ? "🎙️ Listening..."
              : "🎤 Start Speaking"}

          </button>
        )}


        {/* AI FEEDBACK */}
        {aiFeedback && (

          <div className="bg-gray-800 border border-green-500 rounded-lg p-4 space-y-2">

            <h3 className="text-green-400 font-semibold">

              AI Feedback

            </h3>

            <p className="text-white">

              Score:

              <span className="text-blue-400 font-bold">

                {" "}
                {aiFeedback.score}/10

              </span>

            </p>

            <p className="text-gray-300">

              {aiFeedback.feedback}

            </p>

          </div>
        )}


        {/* BUTTON */}
        {!showFeedback ? (

          <button
            onClick={handleSubmitAnswer}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >

            {loading
              ? "AI Evaluating..."
              : "Submit Answer"}

          </button>

        ) : (

          <button
            onClick={handleNextQuestion}
            className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold transition"
          >

            {currentQuestion <
            questions.length - 1
              ? "Next Question"
              : "Finish Interview"}

          </button>

        )}

      </div>

    </div>
  );
}

export default Interview;

