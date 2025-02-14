import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const accessToken = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    if (!accessToken) return;

    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTracks(response.data.items);
      } catch (error) {
        console.error("Top Tracks Fetch Error:", error);
      }
    };

    fetchTopTracks();
  }, [accessToken]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Most Streamed Songs On Last Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tracks.map((track, index) => (
              <li key={track.id} className="flex items-center space-x-4">
                <span className="font-semibold">{index + 1}.</span>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-medium">{track.name}</p>
                  <p className="text-sm text-gray-500">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopTracks;
