import { useEffect, useState } from "react";

function Profile() {

  const [bio, setBio] = useState("");

  const [skills, setSkills] = useState("");

  const [preferredInterviewType, setPreferredInterviewType] =
    useState("");

  const [message, setMessage] = useState("");

  // FETCH PROFILE
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/get-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(data);

        setBio(data.bio || "");

        setSkills(data.skills?.join(", ") || "");

        setPreferredInterviewType(
          data.preferredInterviewType || ""
        );

      } catch (error) {

        console.log(error);
      }
    };

    fetchProfile();

  }, []);

  // UPDATE PROFILE
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/update-profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            bio,
            skills: skills.split(","),
            preferredInterviewType,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>My Profile</h1>

      <p>{message}</p>

      <form onSubmit={handleUpdate}>

        <textarea
          rows="5"
          cols="40"
          placeholder="Enter bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Skills (React, Node, MongoDB)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Preferred Interview Type"
          value={preferredInterviewType}
          onChange={(e) =>
            setPreferredInterviewType(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Update Profile
        </button>

      </form>

    </div>
  );
}

export default Profile;