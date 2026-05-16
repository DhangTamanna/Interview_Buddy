import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateQuestions } from "../services/ai";

function Dashboard() {

  const navigate = useNavigate();

  const [difficulty, setDifficulty] =
    useState("Medium");

  // ✅ ADDED
  const [resumeFile, setResumeFile] =
    useState(null);

  // ✅ ADDED
  const [loading, setLoading] =
    useState(false);

  const interviewCategories = [
    "Frontend",
    "Backend",
    "DSA",
    "HR",
    "Java",
    "MERN Stack",
  ];


  // ================= NORMAL AI INTERVIEW =================

  const handleStart = async (
    category
  ) => {

    try {

      setLoading(true);

      const data =
        await generateQuestions(
          category,
          difficulty
        );

      navigate("/interview", {
        state: {
          category,
          questions:
            data.questions,
        },
      });

    } catch (error) {

      console.log(
        "Error generating questions:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  // ================= RESUME INTERVIEW =================

  const handleResumeInterview =
    async () => {

      try {

        if (!resumeFile) {

          return alert(
            "Please upload a PDF resume"
          );
        }

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
        );

        const response =
          await fetch(
            "https://interview-buddy-backend-7udp.onrender.com/api/ai/resume-interview",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Resume Questions:",
          data
        );

        navigate("/interview", {
          state: {
            category:
              "Resume Interview",

            questions:
              data.questions,
          },
        });

      } catch (error) {

        console.log(
          "Resume Interview Error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };


  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">

        <h1 className="text-2xl font-bold text-white">

          Interview Dashboard

        </h1>

        <p className="text-gray-400 mt-1">

          Select an interview category to start practicing

        </p>

        {/* DIFFICULTY SELECTOR */}
        <div className="mt-4">

          <label className="text-gray-400 text-sm">

            Select Difficulty

          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value
              )
            }
            className="ml-3 bg-gray-800 text-white p-2 rounded"
          >

            <option>
              Easy
            </option>

            <option>
              Medium
            </option>

            <option>
              Hard
            </option>

          </select>

        </div>

      </div>


      {/* ✅ RESUME INTERVIEW SECTION ADDED */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4">

        <h2 className="text-xl font-semibold text-white">

          Resume-Based AI Interview

        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setResumeFile(
              e.target.files[0]
            )
          }
          className="text-white"
        />

        <button
          onClick={
            handleResumeInterview
          }
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
        >

          {loading
            ? "Generating..."
            : "Start Resume Interview"}

        </button>

      </div>


      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {interviewCategories.map(
          (category, index) => (

            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:scale-[1.02] transition"
            >

              <h3 className="text-lg font-semibold text-white mb-4">

                {category}

              </h3>

              <button
                onClick={() =>
                  handleStart(
                    category
                  )
                }
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >

                {loading
                  ? "Generating..."
                  : "Start Interview"}

              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default Dashboard;