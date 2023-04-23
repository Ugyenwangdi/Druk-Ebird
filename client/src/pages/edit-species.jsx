import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";

import "../styles/addspecies.css";

function AddSpecies() {
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState(
    location.state?.speciesDetail || {
      englishName: "",
      scientificName: "",
      order: "",
      familyName: "",
      genus: "",
      species: "",
      authority: "",
      group: "",
      dzongkhaName: "",
      lhoName: "",
      sharName: "",
      khengName: "",
      iucnStatus: "",
      legislation: "",
      migrationStatus: "",
      birdType: "",
      description: "",
      observations: 0,
      photos: [],
    }
  );

  const [speciesImg, setSpeciesImg] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // get the species details from the API
    const getSpeciesDetails = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/species/${id}`
      );
      const data = await response.json();
      setForm(data);
    };

    getSpeciesDetails();
  }, [id]);

  const handleChange = (event) => {
    setMsg("");
    setError("");

    if (event.target.name === "photo") {
      const file = event.target.files[0];
      TransformFileData(file);
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSpeciesImg(reader.result);
      };
    } else {
      setSpeciesImg("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.patch(
        `http://localhost:8080/api/v1/species/${id}`,
        {
          ...form,
          photos: [speciesImg],
        }
      ); // send patch request to server
      const data = await res.data.data;
      setForm(data);
      setMsg(res.data.message);
      console.log(res.data.message);
    } catch (err) {
      setError("Server error!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (photoId) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/species/${id}/photos/${photoId}`
      );
      setForm((prevSpecies) => ({
        ...prevSpecies,
        photos: prevSpecies.photos.filter((photo) => photo._id !== photoId),
      }));
      setMsg(res.data.message);
      setError("");
      console.log(res.data.message);
    } catch (error) {
      console.error(error);
      setError("Server error!");
    }
    setLoading(false);
  };

  return (
    <div className="add-species-container">
      <div className="species-header">
        <Link to={`/species/${id}`}>
          <span className="material-icons back-arrow">arrow_back_ios</span>
        </Link>
        <h2>Edit Species</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="speciescontainer">
          <div className="column1">
            <b>1. General Info</b>
          </div>
          <div className="column2">
            <div>English Name</div>
            <input
              type="text"
              name="englishName"
              value={form.englishName}
              onChange={handleChange}
              placeholder="Enter English Name"
              required
            />

            <div>Order</div>
            <input
              type="text"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="Enter Order"
            />

            <div>Genus</div>
            <input
              type="text"
              name="genus"
              value={form.genus}
              onChange={handleChange}
              placeholder="Enter Genus"
            />

            <div>Authority</div>
            <input
              type="text"
              name="authority"
              value={form.authority}
              onChange={handleChange}
              placeholder="Enter Authority"
            />

            <div>Dzongkha Name</div>
            <input
              type="text"
              name="dzongkhaName"
              value={form.dzongkhaName}
              onChange={handleChange}
              placeholder="Enter Dzongkha Name"
            />

            <div>Shar Name</div>
            <input
              type="text"
              name="sharName"
              value={form.sharName}
              onChange={handleChange}
              placeholder="Enter Shar Name"
            />

            <div>IUCN Status</div>
            <input
              type="text"
              name="iucnStatus"
              value={form.iucnStatus}
              onChange={handleChange}
              placeholder="Enter IUCN Status"
            />

            <div>Migratory/Non-migratory</div>
            {/* <input type="text" placeholder="Enter Migratory/Non-migratory" /> */}
            <select
              className="select-status"
              name="migrationStatus"
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="Migratory">Migratory</option>
              <option value="Non-migratory">Non Migratory</option>
            </select>

            <div>Species Description</div>
            <input
              className="description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Species Description"
            />
          </div>
          <div className="column3">
            <div>Scientific Name</div>

            <input
              type="text"
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              placeholder="Enter Scientific Name"
            />

            <div>Family Name</div>
            <input
              type="text"
              name="familyName"
              value={form.familyName}
              onChange={handleChange}
              placeholder="Enter Family Name"
            />

            <div>Species</div>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              placeholder="Enter Species"
            />
            <div>Group</div>
            <input
              type="text"
              name="group"
              value={form.group}
              onChange={handleChange}
              placeholder="Enter Group"
            />

            <div>Lho Name</div>
            <input
              type="text"
              name="lhoName"
              value={form.lhoName}
              onChange={handleChange}
              placeholder="Enter Lho Name"
            />

            <div>Kheng Name</div>
            <input
              type="text"
              name="khengName"
              value={form.khengName}
              onChange={handleChange}
              placeholder="Enter Kheng Name"
            />

            <div>Legislation</div>
            <input
              type="text"
              name="legislation"
              value={form.legislation}
              onChange={handleChange}
              placeholder="Enter Legislation"
            />

            <div>Waterbird/Landbird/Seabird</div>
            {/* <input type="text" placeholder="Enter Waterbird/Landbird/Seabird" /> */}
            <select
              className="select-status"
              name="birdType"
              onChange={handleChange}
            >
              <option className="select-status-item" value="">
                Select type
              </option>
              <option className="select-status-item" value="Waterbird">
                Waterbird
              </option>
              <option className="select-status-item" value="Landbird">
                Landbird
              </option>
              <option className="select-status-item" value="Seabird">
                Seabird
              </option>
            </select>

            <div>No. of Observation</div>
            <div className="number-input">
              <input
                min="0"
                name="observations"
                value={form.observations}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="speciescontainer">
          <div className="column1">2. Media</div>
          <div className="column2">
            <div>Image</div>
            <input
              className="select-photo"
              name="photo"
              accept="image/*"
              type="file"
              onChange={handleChange}
            />
          </div>
          <div className="column3"></div>
        </div>
        <div className="speciesbuttoncontainer">
          <div className="button-container-addspecies">
            <Link to="/species">
              <button className="cancle-button">Cancel</button>
            </Link>
            <button disabled={loading} className="update-button" type="submit">
              Update
            </button>
          </div>
        </div>
      </form>

      <div className="previewcontainer">
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            <p>Loading....</p>
          </div>
        )}

        <div className="imgpreview">
          <div>Image Preview:</div>
          {speciesImg ? (
            <>
              <img src={speciesImg} alt="Species" style={{ width: "400px" }} />
            </>
          ) : (
            <p>Product image upload preview will appear here!</p>
          )}
        </div>

        <br></br>
        <div className="uploaded-images">
          Uploaded images:
          <div>
            {form.photos ? (
              <>
                {form.photos.map((photo, index) => (
                  <div key={index} className="uploaded-photos-img-container">
                    <img
                      src={photo.url}
                      alt={photo.englishName}
                      style={{
                        width: "200px",
                      }}
                    />
                    <div className="delete-button-container">
                      <button
                        className="delete-button"
                        disabled={loading}
                        onClick={() => handleDeleteClick(photo._id)}
                      >
                        Delete Photo
                      </button>
                    </div>
                  </div>
                ))}
                {/* {speciesImg && <img src={speciesImg} alt="Species" />} */}
              </>
            ) : (
              <p>Image not uploaded!</p>
            )}
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}

export default AddSpecies;

// import React, { useState, useEffect } from "react";
// import { useParams, useLocation, Link } from "react-router-dom";
// import axios from "axios";

// function EditSpecies() {
//   const { id } = useParams();
//   const location = useLocation();

//   const [form, setForm] = useState(
//     location.state?.speciesDetail || {
//       englishName: "",
//       scientificName: "",
//       order: "",
//       familyName: "",
//       genus: "",
//       species: "",
//       authority: "",
//       group: "",
//       dzongkhaName: "",
//       lhoName: "",
//       sharName: "",
//       khengName: "",
//       iucnStatus: "",
//       legislation: "",
//       migrationStatus: "",
//       birdType: "",
//       description: "",
//       observations: 0,
//       photos: [],
//     }
//   );

//   const [speciesImg, setSpeciesImg] = useState("");
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // get the species details from the API
//     const getSpeciesDetails = async () => {
//       const response = await fetch(
//         `http://localhost:8080/api/v1/species/${id}`
//       );
//       const data = await response.json();
//       setForm(data);
//     };

//     getSpeciesDetails();
//   }, [id]);

//   const handleChange = (event) => {
//     setMsg("");
//     if (event.target.name === "photo") {
//       const file = event.target.files[0];
//       TransformFileData(file);
//     } else {
//       setForm({ ...form, [event.target.name]: event.target.value });
//     }
//   };

//   const TransformFileData = (file) => {
//     const reader = new FileReader();
//     if (file) {
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setSpeciesImg(reader.result);
//       };
//     } else {
//       setSpeciesImg("");
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.patch(
//         `http://localhost:8080/api/v1/species/${id}`,
//         {
//           ...form,
//           photos: [speciesImg],
//         }
//       ); // send patch request to server
//       const data = await res.data.data;
//       setForm(data);
//       setMsg(res.data.message);
//       console.log(res.data.message);
//     } catch (err) {
//       setError("Server error!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClick = async (photoId) => {
//     setLoading(true);
//     try {
//       const res = await axios.delete(
//         `http://localhost:8080/api/v1/species/${id}/photos/${photoId}`
//       );
//       setForm((prevSpecies) => ({
//         ...prevSpecies,
//         photos: prevSpecies.photos.filter((photo) => photo._id !== photoId),
//       }));
//       setMsg(res.data.message);
//       setError("");
//       console.log(res.data.message);
//     } catch (error) {
//       console.error(error);
//       setError("Server error!");
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Edit Species</h1>

//       <form onSubmit={handleSubmit}>
//         <label>
//           English Name:
//           <input
//             type="text"
//             name="englishName"
//             value={form.englishName}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Scientific Name:
//           <input
//             type="text"
//             name="scientificName"
//             value={form.scientificName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Order:
//           <input
//             type="text"
//             name="order"
//             value={form.order}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Family Name:
//           <input
//             type="text"
//             name="familyName"
//             value={form.familyName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Genus:
//           <input
//             type="text"
//             name="genus"
//             value={form.genus}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Species:
//           <input
//             type="text"
//             name="species"
//             value={form.species}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Authority:
//           <input
//             type="text"
//             name="authority"
//             value={form.authority}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Group:
//           <input
//             type="text"
//             name="group"
//             value={form.group}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Dzongkha Name:
//           <input
//             type="text"
//             name="dzongkhaName"
//             value={form.dzongkhaName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Lho Name:
//           <input
//             type="text"
//             name="lhoName"
//             value={form.lhoName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Shar Name:
//           <input
//             type="text"
//             name="sharName"
//             value={form.sharName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Kheng Name:
//           <input
//             type="text"
//             name="khengName"
//             value={form.khengName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           IUCN Status:
//           <input
//             type="text"
//             name="iucnStatus"
//             value={form.iucnStatus}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Legislation:
//           <input
//             type="text"
//             name="legislation"
//             value={form.legislation}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Migration Status:
//           <select
//             name="migrationStatus"
//             value={form.migrationStatus}
//             onChange={handleChange}
//           >
//             <option value="">Select status</option>
//             <option value="migratory">Migratory</option>
//             <option value="non migratory">Non Migratory</option>
//           </select>
//         </label>

//         <br></br>
//         <br></br>
//         <label>
//           Waterbird/Landbird/Seabird:
//           <select name="birdType" value={form.birdType} onChange={handleChange}>
//             <option value="">Select type</option>
//             <option value="waterbird">Waterbird</option>
//             <option value="landbird">Landbird</option>
//             <option value="seabird">Seabird</option>
//           </select>
//         </label>
//         <br></br>
//         <br></br>
//         <label>
//           Description:
//           <input
//             type="text"
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           observation:
//           <input
//             type="text"
//             name="observations"
//             value={form.observations}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Photo:
//           <input
//             name="photo"
//             accept="image/*"
//             type="file"
//             onChange={handleChange}
//           />
//         </label>

//         <button disabled={loading} type="submit">
//           Submit
//         </button>
//       </form>
//       <br></br>
//       <br></br>
//       {loading && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             fontSize: "18px",
//           }}
//         >
//           <p>Loading....</p>
//         </div>
//       )}
//       {error && <div className="error_msg">{error}</div>}
//       {msg && <div className="success_msg">{msg}</div>}
//       <br></br>
//       <br></br>
//       <div>
//         Image Preview:
//         {speciesImg ? (
//           <>
//             <img
//               src={speciesImg}
//               alt="Species"
//               style={{
//                 width: "200px",
//               }}
//             />
//           </>
//         ) : (
//           <p>Product image upload preview will appear here!</p>
//         )}
//       </div>
//       <br></br>
//       <div>
//         Uploaded images:
//         <div>
//           {form.photos ? (
//             <>
//               {form.photos.map((photo, index) => (
//                 <div key={index}>
//                   <img
//                     src={photo.url}
//                     alt={photo.englishName}
//                     style={{
//                       width: "200px",
//                     }}
//                   />
//                   <div className="button-container">
//                     <button
//                       disabled={loading}
//                       onClick={() => handleDeleteClick(photo._id)}
//                     >
//                       Delete Photo
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {/* {speciesImg && <img src={speciesImg} alt="Species" />} */}
//             </>
//           ) : (
//             <p>Image not uploaded!</p>
//           )}
//         </div>
//       </div>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <Link to={`/species/${id}`} className="add-button">
//         Go Back
//       </Link>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//     </div>
//   );
// }

// export default EditSpecies;