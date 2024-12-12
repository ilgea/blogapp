import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {

  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    // Kullanıcı durumu yüklenirken gösterilecek bir yükleme ekranı
    return <div>Yükleniyor.Lütfen bekleyiniz...</div>;
  }
  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRouter;
