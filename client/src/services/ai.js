export const generateQuestions = async (category, difficulty) => {
  const res = await fetch("https://interview-buddy-backend-7udp.onrender.com/api/ai/generate-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, difficulty }),
  });

  return res.json();
};