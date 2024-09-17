import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { preview } from "../images";
import "../styles/speciesdetails.css";

function SpeciesDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [species, setSpecies] = useState(
    location.state?.speciesDetails || { photos: [] }
  );

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:8080/api/v1/species/${id}`
        // );
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/species/${id}`
        );

        setSpecies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [id]);

  // console.log(species.photos[0].caption);

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  if (!species) {
    return <div>Loading...</div>;
  }

  return (
    <div className="species-details-container">
      {showFullscreen && (
        <div className="fullscreen-container">
          <button className="close-button" onClick={toggleFullscreen}>
            <span className="material-icons">close</span>
          </button>
          <img src={species.photos[0].url} alt="Species" />
        </div>
      )}
      <h2 className="species-details-header">
        <div className="header">
          <Link to="/species">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          Species Details
        </div>

        <Link to={`/species/${id}/edit`} state={{ speciesDetail: species }}>
          <button className="edit-button">Edit</button>
        </Link>
      </h2>
      <div className="species-images">
        <div className="img-bird">
          <img
            className="species-image1"
            src={species.photos[0] ? species.photos[0].url : preview}
            alt="species1"
            onClick={toggleFullscreen}
          />
        </div>

        <div className="species-image-column1">
          <h3 className="bird-name">{species.englishName}</h3>
          <div className="scientific-name">{species.scientificName}</div>
          <div className="IUCNStatus">IUCN Status: {species.iucnStatus}</div>

        </div>
      </div>

      <div class="species-container">
  <div class="species-row">
    <div class="species-label">Species Name</div>
    <div class="species-value">{species.englishName ? species.englishName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Location</div>
    <div class="species-value">{species.location ? species.location : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Scientific Name</div>
    <div class="species-value">{species.scientificName ? species.scientificName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Order</div>
    <div class="species-value">{species.order ? species.order : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Family Name</div>
    <div class="species-value">{species.familyName ? species.familyName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Genus</div>
    <div class="species-value">{species.genus ? species.genus : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Species</div>
    <div class="species-value">{species.species ? species.species : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Authority</div>
    <div class="species-value">{species.authority ? species.authority : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Group</div>
    <div class="species-value">{species.group ? species.group : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Dzongkha Name</div>
    <div class="species-value">{species.dzongkhaName ? species.dzongkhaName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Lho Name</div>
    <div class="species-value">{species.lhoName ? species.lhoName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Shar Name</div>
    <div class="species-value">{species.sharName ? species.sharName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Kheng Name</div>
    <div class="species-value">{species.khengName ? species.khengName : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">IUCN Status</div>
    <div class="species-value">{species.iucnStatus ? species.iucnStatus : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Cites Appendix</div>
    <div class="species-value">{species.citesAppendix ? species.citesAppendix : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Bhutan Schedule</div>
    <div class="species-value">{species.bhutanSchedule ? species.bhutanSchedule : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Residency</div>
    <div class="species-value">{species.residency ? species.residency : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Habitat</div>
    <div class="species-value">{species.habitat ? species.habitat : 'null'}</div>
  </div>

  <div class="species-row">
    <div class="species-label">Stats</div>
    <div class="species-value">300 Observations</div>
  </div>

  <div class="species-row">
    <div class="species-label">Description</div>
    <div class="species-value">{species.description ? species.description : 'null'}</div>
  </div>
</div>

    </div>
  );
}

export default SpeciesDetails;
