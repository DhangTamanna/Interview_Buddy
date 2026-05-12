import { useEffect, useState } from "react";

function History() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/results",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Interview History</h1>

      {results.length === 0 ? (
        <p>No interview history found.</p>
      ) : (
        results.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{item.category}</h3>

            <p>
              <strong>Score:</strong> {item.score}
            </p>

            <p>
              <strong>Total Answers:</strong> {item.answers.length}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;