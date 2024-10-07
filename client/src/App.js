import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  ListGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import searchLogo from './img/loupe.png';

var SpotifyWebApi = require("spotify-web-api-node");

document.body.style.backgroundColor = "#191414";

// Spotify Authentication Keys
const CLIENT_ID = "2754ffafe92e47b9bd6d17bec67e45b2";
const CLIENT_SECRET = "d6bf9ff451ec4ca0bb2b1e662c41276e";

// Credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: "http://localhost:3000/",
});

// Main app functions
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [artistSuggestions, setArtistSuggestions] = useState([]);

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

  // Artist searching function
  async function search(artistID) {
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

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
        setArtistSuggestions([]);
      });
  }

  // Artists suggestions function
  async function getArtistSuggestions(query) {
    if (!query) {
      setArtistSuggestions([]);
      return;
    }

    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    await fetch(
      "https://api.spotify.com/v1/search?q=" + query + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.artists) {
          setArtistSuggestions(data.artists.items.slice(0, 10));
        }
      });
  }

  return (
    <div className="App-container">
      <Container className="text-center py-3 title">
        <h1>Spotify Cover</h1>
      </Container>

      <Container className="py-5" style={{ position: "relative" }}>
        <div className="d-flex justify-content-center">
          <InputGroup className="mb-3 py-0" size="lg" style={{ width: "60%" }}>
            <FormControl
              placeholder="Research an artist"
              type="input"
              style={{ borderRadius: "15px 0 0 0" }}
              onChange={(event) => {
                setSearchInput(event.target.value);
                getArtistSuggestions(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" && artistSuggestions.length > 0) {
                  search(artistSuggestions[0].id);
                }
              }}
            />
            <Button
              onClick={() => {
                if (artistSuggestions.length > 0) {
                  search(artistSuggestions[0].id);
                }
              }}
              style={{
                backgroundColor: "#1DB954",
                borderColor: "#1DB954",
                color: "#191414",
                borderRadius: "0 15px 0 0",
              }}
            >
              <img src={searchLogo} style={{ width: "35px" }} />
            </Button>
          </InputGroup>
        </div>
        <div className="d-flex justify-content-center">
          {/* Display suggestions (max 10) */}
          {artistSuggestions.length > 0 && (
            <ListGroup
              className="suggestions-list"
              style={{
                backgroundColor: "#ffffff83",
                zIndex: "1000",
                position: "absolute",
                width: "58.8%",
                top: "60%",
                borderRadius: "0 0 15px 15px",
              }}
            >
              {artistSuggestions.map((artist) => (
                <ListGroup.Item
                  key={artist.id}
                  className="suggestions-list-item"
                  action
                  onClick={() => {
                    search(artist.id);
                  }}
                >
                  {artist.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </Container>

      <Container>
        <Row className="row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card
                className="my-2 custom-card"
                key={i}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title style={{ color: "white" }}>
                    {album.name}
                  </Card.Title>
                  <Button
                    href={album.images[0].url}
                    target="_blank"
                    style={{
                      backgroundColor: "#1DB954",
                      border: "none",
                      color: "white",
                      boxShadow:
                        "0 0 5px #1DB954, 0 0 5px #1DB954, 0 0 5px #1DB954",
                    }}
                  >
                    Download
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>

      {/* Footer */}
      <footer 
        className="text-center py-3" 
        style={{ 
          color: "white", 
          position: "fixed", 
          left: 0, 
          bottom: 0, 
          width: "100%" 
        }}
      >
        <p>
          Open source project - <a href="https://github.com/cyrilnapo/high-quality-cover" target="_blank" rel="noreferrer" style={{ color: "white", textDecoration: "underline" }}>Contribute on GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
