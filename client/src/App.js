// Import des dépendances et des fichiers CSS nécessaires
import logo from "./logo.svg";
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

document.body.style.backgroundColor = "#e8f1ff";

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
  // State pour la valeur de recherche, le token d'accès Spotify, et les albums
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  // Utilisation de useEffect pour obtenir le token d'accès lors du chargement initial de la page
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

  // Fonction de connexion Spotify
  function login() {
    // Définissez les paramètres pour la requête d'autorisation
    const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/&scope=user-read-private%20user-read-email&response_type=token&state=123`;

    // Redirigez l'utilisateur vers l'URL d'autorisation
    window.location = authorizeURL;
  }

  // Fonction de recherche appelée lorsqu'un utilisateur effectue une recherche
  async function search() {
    console.log("Searching for " + searchInput);

    // Requête pour obtenir l'ID de l'artiste à partir de la recherche
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

    // Requête pour obtenir les albums de l'artiste
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
      <Container className="py-5">
        {/* Bouton de connexion Spotify */}
        <Button classname="loginButton" variant="success" onClick={login}>
          Se connecter à Spotify
        </Button>

        {/* Barre de recherche avec bouton de recherche */}
        <InputGroup className="mb-3 py-5" size="lg">
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
          <Button onClick={search}>Recherche</Button>
        </InputGroup>
      </Container>

      {/* Grille pour afficher les albums */}
      <Container>
        <Row className="row-cols-4">
          {albums.map((album, i) => {
            return (
              // Carte pour afficher chaque album avec un bouton de téléchargement
              <Card className="my-2 custom-card" key={i}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                  <Button href={album.images[0].url} target="_blank">
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
