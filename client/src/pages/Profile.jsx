import { useEffect, useState } from "react";

function Profile() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [
    preferredInterviewType,
    setPreferredInterviewType,
  ] = useState("");

  const [message, setMessage] =
    useState("");


  // ================= FETCH PROFILE =================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "https://interview-buddy-backend-7udp.onrender.com/profile",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        console.log(
          "PROFILE DATA:",
          data
        );

        setName(data.name || "");

        setEmail(data.email || "");

        setBio(data.bio || "");

        setSkills(
          data.skills?.join(", ") || ""
        );

        setPreferredInterviewType(
          data.preferredInterviewType || ""
        );

      } catch (error) {

        console.log(
          "Fetch profile error:",
          error
        );
      }
    };

    fetchProfile();

  }, []);


  // ================= UPDATE PROFILE =================

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "https://interview-buddy-backend-7udp.onrender.com/update-profile",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            bio,
            skills:
              skills
                .split(",")
                .map((s) => s.trim()),

            preferredInterviewType,
          }),
        }
      );

      const data =
        await response.json();

      setMessage(
        data.message ||
        "Profile updated successfully"
      );

      // update navbar user instantly
      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        window.dispatchEvent(
          new Event("authChange")
        );
      }

    } catch (error) {

      console.log(
        "Update profile error:",
        error
      );

      setMessage(
        "Something went wrong"
      );
    }
  };


  return (

    <div className="flex justify-center items-start min-h-[80vh] text-white p-6">

      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold">

            {name?.charAt(0).toUpperCase()}

          </div>

          {/* USER INFO */}
          <div>

            <h1 className="text-2xl font-bold text-white">

              {name}

            </h1>

            <p className="text-gray-400">

              {email}

            </p>

          </div>

        </div>


        {/* MESSAGE */}
        {message && (

          <div className="bg-green-900/30 border border-green-700 text-green-400 p-3 rounded-lg">

            {message}

          </div>
        )}


        {/* FORM */}
        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >

          {/* NAME */}
          <div>

            <label className="text-sm text-gray-400">

              Name

            </label>

            <input
              type="text"
              className="w-full mt-1 bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* BIO */}
          <div>

            <label className="text-sm text-gray-400">

              Bio

            </label>

            <textarea
              rows="5"
              className="w-full mt-1 bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
            />

          </div>


          {/* SKILLS */}
          <div>

            <label className="text-sm text-gray-400">

              Skills

            </label>

            <input
              type="text"
              className="w-full mt-1 bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="React, Node, MongoDB"
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
            />

          </div>


          {/* INTERVIEW TYPE */}
          <div>

            <label className="text-sm text-gray-400">

              Preferred Interview Type

            </label>

            <input
              type="text"
              className="w-full mt-1 bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Frontend / Backend / DSA / HR"
              value={
                preferredInterviewType
              }
              onChange={(e) =>
                setPreferredInterviewType(
                  e.target.value
                )
              }
            />

          </div>


          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition"
          >

            Update Profile

          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;