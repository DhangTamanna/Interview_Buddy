import { Link } from "react-router-dom";

function Home() {

  return (

    <div className="min-h-[90vh] bg-gray-950 text-white">

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">

          Ace Your Interviews
          <span className="text-blue-500">
            {" "}with AI
          </span>

        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mt-6 leading-relaxed">

          Practice AI-powered mock interviews,
          upload your resume for personalized
          questions, answer using voice,
          and receive instant AI feedback.

        </p>


        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 mt-8">

          <Link
            to="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition"
          >

            Start Interview

          </Link>

          <Link
            to="/profile"
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition border border-gray-700"
          >

            My Profile

          </Link>

        </div>

      </div>


      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">

        {/* FEATURE 1 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">

          <div className="text-4xl mb-4">
            🤖
          </div>

          <h3 className="text-xl font-semibold mb-2">

            AI Interviews

          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">

            Generate intelligent interview
            questions dynamically using AI.

          </p>

        </div>


        {/* FEATURE 2 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">

          <div className="text-4xl mb-4">
            📄
          </div>

          <h3 className="text-xl font-semibold mb-2">

            Resume Analysis

          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">

            Upload your resume and receive
            personalized interview questions.

          </p>

        </div>


        {/* FEATURE 3 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">

          <div className="text-4xl mb-4">
            🎤
          </div>

          <h3 className="text-xl font-semibold mb-2">

            Voice Answers

          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">

            Practice interviews naturally
            using speech recognition.

          </p>

        </div>


        {/* FEATURE 4 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition">

          <div className="text-4xl mb-4">
            📊
          </div>

          <h3 className="text-xl font-semibold mb-2">

            AI Feedback

          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">

            Receive instant evaluation,
            scoring, and interview feedback.

          </p>

        </div>

      </div>


      {/* BOTTOM SECTION */}
      {/* FOOTER */}
<footer className="border-t border-gray-800 mt-10">

  <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

    {/* LEFT */}
    <div>

      <h2 className="text-lg font-semibold text-white">

        InterviewBuddy

      </h2>

      <p className="text-sm text-gray-400 mt-1">

        AI-powered mock interview platform
        for smarter interview preparation.

      </p>

    </div>


    {/* RIGHT */}
    <div className="flex gap-6 text-sm text-gray-400">

      <span>
        AI Interviews
      </span>

      <span>
        Resume Analysis
      </span>

      <span>
        Voice Practice
      </span>

    </div>

  </div>

</footer>

    </div>
  );
}

export default Home;