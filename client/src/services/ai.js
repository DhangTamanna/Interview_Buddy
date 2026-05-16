export const generateQuestions = async (category, difficulty) => {
  const res = await fetch("http://localhost:5000/api/ai/generate-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, difficulty }),
  });

  return res.json();
};