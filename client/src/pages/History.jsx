import { useEffect, useState } from "react";

function History() {

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchResults = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://interview-buddy-backend-7udp.onrender.com/results",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setResults(Array.isArray(data) ? data : []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchResults();

  }, []);

  if (loading) {
    return (
      <div className="text-white text-xl p-6">
        Loading...
      </div>
    );
  }

  return (

    <div className="p-6 min-h-screen bg-gray-950 text-white">

      <h1 className="text-3xl font-bold mb-8 text-blue-400">
        Interview History
      </h1>

      {results.length === 0 ? (

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400">
            No interview history found.
          </p>
        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2">

          {results.map((item) => (

            <div
              key={item._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition duration-300"
            >

              <div className="flex justify-between items-center">

                <h2 className="text-xl font-bold text-blue-400">
                  {item.category}
                </h2>

                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.score}/10
                </span>

              </div>

              <div className="mt-4 space-y-2">

                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    Total Answers:
                  </span>{" "}
                  {item.answers?.length || 0}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default History;