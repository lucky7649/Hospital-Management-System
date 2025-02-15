import React,{useState, useEffect} from "react";
import axios from "axios";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import DragDropFileUpload from "../components/CommanComponents/DropDownFileUpload";

const ProfilePage = () => {

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  
 const [formData, setFormData] = useState({
   _id: "",
   username: "", // Added because it's required in the schema
   name: "",
   email: "",
   age: "",
   gender: "",
   weight: "",
   street: "",
   city: "",
   state: "",
   postalCode: "",
   country: "",
   dateOfBirth: "",
   profileImg: "", // Updated to match profileImg in the schema
});

  const [isEditing, setIsEditing] = useState(false);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
  };
  
    const handleFileUpload = (filePath) => {
      setFormData({
        ...formData,
        profileImg: filePath,
      });
    };

    useEffect(() => {
      const fetchUser = async () => {
        try {

            const headers = {
              id: localStorage.getItem("id"),
              authorization: `Bearer ${localStorage.getItem("token")}`,
            };
          const response = await axios.get(
            `http://localhost:1000/api/v1/get-user-information`,
            { headers }
          );
          setFormData(response.data.data);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      
      setLoading(true);
      const headers = {
        id: localStorage.getItem("userId"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      await axios.put(
        `http://localhost:1000/api/v1/update-patient/${formData._id}`,
        formData,
        { headers }
      );
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }
  const DOB = formData?.dateOfBirth ? formData.dateOfBirth.split("T")[0] : "N/A";



  return (
    <div className=" min-h-screen bg-gray-100 p-6 px-32 py-4">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-600 ">Profile</h1>
        {!isEditing ? (
          <div className="flex gap-4 justify-center">
            <div className="bg-white shadow-lg  w-fit flex flex-col items-center gap-4 p-4 rounded-lg">
              <div className="w-96 h-[50vh] border-2 border-dashed rounded-xl border-gray-300  flex justify-center items-center cursor-pointer hover:bg-gray-100  transition p-4">
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={`http://localhost:1000/uploads/${formData?.profileImg}`}
                    alt={`${formData?.name}`}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div className="mt-4 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 hover:shadow-lg text-white rounded-md bg-blue-600"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="w-1/2 bg-white shadow-lg  p-4  rounded-lg">
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData?.username}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData?.phone}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData?.age}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium mb-2"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={formData?.gender}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium mb-2"
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData?.weight}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData?.city}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium mb-2"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData?.state}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-2"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData?.country}
                  onChange={handleChange}
                  disabled={!isEditing} // Disable the input if not in editing mode
                  className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium mb-2"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData?.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing} // Disable the input if not in editing mode
                  className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        ) : (
          <form className="flex gap-4 justify-center" onSubmit={handleSubmit}>
            <div className="bg-white shadow-lg w-fit flex flex-col items-center gap-4 p-4 rounded-lg">
              <DragDropFileUpload
                onFileUpload={handleFileUpload}
                height="50vh"
                defaultImage={formData?.profileImg}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md "
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="w-1/2 bg-white shadow-lg p-4  rounded-lg">
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium mb-2"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/3">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium mb-2"
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData?.city}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4 w-1/2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium mb-2"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData?.state}
                    onChange={handleChange}
                    disabled={!isEditing} // Disable the input if not in editing mode
                    className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-2"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData?.country}
                  onChange={handleChange}
                  disabled={!isEditing} // Disable the input if not in editing mode
                  className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium mb-2"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData?.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing} // Disable the input if not in editing mode
                  className="w-full p-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

}
export default ProfilePage;
