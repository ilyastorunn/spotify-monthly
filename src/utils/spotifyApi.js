import axios from "axios";

// export const getUserPlaylists = async (accessToken) => {
//   try {
//     const response = await axios.get(
//       "https://api.spotify.com/v1/me/playlists",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return response.data.items;
//   } catch (error) {
//     console.error("Error fetching user playlists:", error);
//     return [];
//   }
// };

export const getUserPlaylists = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists?limit=50", // Limit artırıldı
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Fetched playlists:", response.data.items); // Konsolda test edelim
    return response.data.items;
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    return [];
  }
};

export const createPlaylist = async (accessToken, userId, playlistName) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        description:
          "This playlist includes your most streamed songs on last month.",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("Error creating playlist:", error);
    return null;
  }
};

export const clearPlaylist = async (accessToken, playlistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const trackUris = response.data.items.map((item) => ({
      uri: item.track.uri,
    }));

    if (trackUris.length > 0) {
      await axios.request({
        method: "DELETE",
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          tracks: trackUris,
        },
      });
    }
  } catch (error) {
    console.error("Error clearing playlist:", error);
  }
};

export const addTracksToPlaylist = async (
  accessToken,
  playlistId,
  trackUris
) => {
  if (!trackUris.length) {
    console.error("No tracks found to add.");
    return;
  }

  try {
    console.log(`Adding ${trackUris.length} tracks to playlist ${playlistId}`);
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Tracks added successfully:", response.data);
  } catch (error) {
    console.error("Error adding tracks to playlist:", error);
  }
};

export const updateMonthlyPlaylist = async (accessToken, userId) => {
  const playlistName = "Most Streamed Songs on Last Month";

  console.log("Fetching user playlists...");
  let playlists = await getUserPlaylists(accessToken);
  console.log("User playlists before update:", playlists);

  let playlist = playlists.find(
    (pl) => pl.name.trim().toLowerCase() === playlistName.trim().toLowerCase()
  );

  if (!playlist) {
    console.log("Playlist bulunamadı, yeni oluşturuluyor...");
    const playlistId = await createPlaylist(accessToken, userId, playlistName);
    if (!playlistId) return;

    // Yeni oluşturduğumuz playlisti direkt ID ile kullanabiliriz
    playlist = { id: playlistId };

    console.log("Yeni playlist oluşturuldu, tekrar listeleri alıyoruz...");

    // 5 saniye bekleyerek Spotify'ın yeni playlisti API'ye eklemesini bekleyelim
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Playlisti tekrar çekelim
    playlists = await getUserPlaylists(accessToken);
    console.log("User playlists after update:", playlists);

    const foundPlaylist = playlists.find(
      (pl) => pl.name.trim().toLowerCase() === playlistName.trim().toLowerCase()
    );

    if (foundPlaylist) {
      playlist = foundPlaylist;
    }
  }

  if (!playlist) {
    console.error("Playlist bulunamıyor, tekrar kontrol edin.");
    return;
  }

  console.log("Playlist bulundu, güncelleniyor...", playlist);

  await clearPlaylist(accessToken, playlist.id);

  const response = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.data.items.length) {
    console.error("No top tracks found!");
    return;
  }

  const trackUris = response.data.items.map((track) => track.uri);
  console.log("Adding tracks to playlist:", trackUris);

  await addTracksToPlaylist(accessToken, playlist.id, trackUris);

  console.log("Playlist başarıyla güncellendi!");
};
