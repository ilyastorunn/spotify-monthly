import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaSpotify } from "react-icons/fa6";

const SpotifyLogin = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT;
  const RESPONSE_TYPE = import.meta.env.VITE_SPOTIFY_RESPONSE_TYPE;
  const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES;

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button className="w-full bg-green-500 hover:bg-green-600">
            <a href={loginUrl}>
              <FaSpotify className="w-5 h-5 mr-2" />
              Login with Spotify
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifyLogin;

console.log("CLIENT_ID:", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
console.log("REDIRECT_URI:", import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
console.log("AUTH_ENDPOINT:", import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT);
console.log("SCOPES:", import.meta.env.VITE_SPOTIFY_SCOPES);