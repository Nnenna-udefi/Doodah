import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";

const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  return children;
};

export default AdminRouteGuard;