import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Alert className="w-[400px]">
        <AlertTitle>Logging in...</AlertTitle>
        <AlertDescription>
          Please wait, connecting to your Spotify account.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Callback;
