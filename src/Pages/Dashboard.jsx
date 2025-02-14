import { useEffect, useState } from "react";
import { getUserPlaylists, updateMonthlyPlaylist } from "../utils/spotifyApi";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TopTracks from "../components/custom/TopTracks";

const Dashboard = () => {
  const accessToken = localStorage.getItem("spotify_access_token");
  const [userId, setUserId] = useState(null);
  const [playlistExists, setPlaylistExists] = useState(false);
  const playlistName = "Most Streamed Songs on Last Month";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) return;

      try {
        const userResponse = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userId = userResponse.data.id;
        setUserId(userId);

        const playlists = await getUserPlaylists(accessToken);
        const existingPlaylist = playlists.find(
          (pl) => pl.name === playlistName
        );

        if (existingPlaylist) {
          setPlaylistExists(true);
        } else {
          setPlaylistExists(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [accessToken]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Monthly Playlist Update</h1>
      {userId && (
        <Button
          className="bg-green-500 hover:bg-green-600 mb-4"
          onClick={() => updateMonthlyPlaylist(accessToken, userId)}
        >
          {playlistExists ? "Update Playlist" : "Create Playlist"}
        </Button>
      )}
    </div>
  );
};

export default Dashboard;
