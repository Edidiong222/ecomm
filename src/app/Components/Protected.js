import { useAuth } from "./AuthStateChanged";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedPage({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) return <p>Loading...</p>;

  return <>{children}</>;
}
