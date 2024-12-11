import { ThemeProvider } from "@emotion/react";
import { theme } from "./utils/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.css";
import AppRouter from "./router/AppRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseUtil";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/auth/authSlice";
import { useEffect, useState } from "react";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // Yüklenme durumu


   // onAuthStateChanged çağrısı, Redux Store zaten doluysa gereksiz yere kullanıcı bilgisini sıfırlamamalı
  
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const updatedUser = {
          displayName: currentUser?.displayName,
          email: currentUser?.email,
          photoURL: currentUser?.photoURL || null,
        };
        // Redux Store'a yalnızca kullanıcı mevcutsa değilse yaz
        if (!user || !user.displayName) {
          dispatch(setUser(updatedUser));
        }
      }
      setLoading(false); // Yüklenme tamamlandı
    });

    return () => unsubscribe(); // Event listener'ı temizle
  }, [dispatch, user]); // user koymazsan kullanıcı ismi gözükmüyor.

  if (loading) {
    // Yüklenirken bir loading spinner gösterebilirsiniz
    return <div>Uygulama yükleniyor. Lütfen Bekleyiniz...</div>;
  }





  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppRouter />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
