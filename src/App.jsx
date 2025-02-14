import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Callback from "./components/custom/Callback";
import SpotifyLogin from "./Pages/SpotifyLogin";
import TopTracks from "./components/custom/TopTracks";

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Spotify Playlist App</CardTitle>
          </CardHeader>
          <CardContent>
            <Routes>
              <Route path="/" element={<SpotifyLogin />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/dashboard" element={<TopTracks />} />
            </Routes>
          </CardContent>
        </Card>
      </div>
    </Router>
  );
}

export default App;
