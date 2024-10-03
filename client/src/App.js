// Import des dépendances et des fichiers CSS nécessaires
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
var SpotifyWebApi = require("spotify-web-api-node");

document.body.style.backgroundColor = "#191414";

// Clés d'authentification Spotify
const CLIENT_ID = "2754ffafe92e47b9bd6d17bec67e45b2";
const CLIENT_SECRET = "d6bf9ff451ec4ca0bb2b1e662c41276e";

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: "http://localhost:3000/",
});

// Fonction principale de l'application
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Fonction de recherche
  async function search() {
    console.log("Searching for " + searchInput);

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("artist id is " + artistID);

    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
  }

  // Rendu de l'interface utilisateur
  return (
    <div className="App-container">
      {/* Ajout du logo Spotify */}
      <Container className="text-center py-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1200px-Spotify_logo_with_text.svg.png"
          alt="Spotify Logo"
          style={{ width: "350px" }}
        />
      </Container>

      <Container className="py-5">
      <div className="d-flex justify-content-center">
        <InputGroup className="mb-3 py-0" size="lg"style={{width:"60%"}}
        >
          <FormControl
            placeholder="rechercher un artiste"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search} style={{ backgroundColor: "#1DB954", borderColor: "#1DB954", color : "#191414" }}>
  Recherche
</Button>
        </InputGroup>
        </div>

      </Container>

      <Container>
        <Row className="row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card className="my-2 custom-card" key={i} style={{ backgroundColor: "transparent", border: "none" }}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title style={{color :"white"}}>{album.name}</Card.Title>
                  <Button href={album.images[0].url} target="_blank" style={{backgroundColor:"#1DB954", border:"none", color:"#191414", boxShadow: "0 0 5px #1DB954, 0 0 5px #1DB954, 0 0 5px #1DB954" }}>
                    Télécharger
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
