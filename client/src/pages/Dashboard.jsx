import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const interviewCategories = [
    "Frontend",
    "Backend",
    "DSA",
    "HR",
    "Java",
    "MERN Stack",
  ];

  return (
    
    <div style={{ padding: "20px" }}>
      
      <h1>Interview Dashboard</h1>

      <p>Select an interview category</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {interviewCategories.map((category, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h3>{category}</h3>

            <button onClick={()=>navigate("/Interview",{state : {category}})}>
              Start Interview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;