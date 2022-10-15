import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext({ isAuthenticated: false });
export const useAdminAuthContext = () => useContext(AuthContext);

const AdminAuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [partners, setPartners] = useState([]);
  const [scores, setScores] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";
  const contextValue = {
    isAuthenticated,
    isChecked,
    setIsChecked,
    setIsAuthenticated,
    scores,
    setScores,
    partners,
    setPartners,
    SERVER_URL,
  };
  console.log(partners,scores)
  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (!authToken) return;
    (async () => {
      const res = await fetch(SERVER_URL + "/admin/verify", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const response = await res.json();
      if (response && response.success) {
        setIsAuthenticated(true);
      }
    })();
  }, []);
  useEffect(()=>{
    if(!isAuthenticated)return;
    try{(async ()=>{
      const res = await fetch(SERVER_URL + "/admin/partners");
      const response = await res.json();
      if (response && response.success) {
        setPartners(response.partnersList)
      }
    })()}
    catch(e){
      console.log(e);
    }
  },[isAuthenticated])
  useEffect(()=>{
    if(!isAuthenticated)return;
    try{(async ()=>{
      const res = await fetch(SERVER_URL + "/score/all");
      const response = await res.json();
      if (response && response.success) {
        setScores(response.scores)
      }
    })()}
    catch(e){
      console.log(e);
    }
  },[isAuthenticated])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AdminAuthContextProvider;
