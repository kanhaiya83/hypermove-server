import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../../context/AdminAuthContext";
import SimpleBar from "simplebar-react";
import { ReactSortable } from "react-sortablejs";

import "simplebar-react/dist/simplebar.min.css";
const AdminHome = () => {
  const { partners, setPartners, SERVER_URL ,scores,setScores,setIsAuthenticated} = useAdminAuthContext();
  const handleDelete = async (id) => {
    const isConfirmed = confirm("Are you confirm you want to delete this logo!")
    if(!isConfirmed) return
    const res = await fetch(SERVER_URL + "/admin/partner/" + id, {
      method: "DELETE",
      headers: { "auth-token": localStorage.getItem("auth-token") },
    });
    const response = await res.json();
    if (response && response.success) {
      setPartners((prev) => {
        return prev.filter((p) => p._id !== id);
      });
    }
  };
  const handleBan=async(id,isBanned)=>{
    const res = await fetch(SERVER_URL + "/score/" + id, {
      method: "PATCH",
      headers: { "auth-token": localStorage.getItem("auth-token") ,"Content-Type":"application/json"},
      body:JSON.stringify({isBanned:!Boolean(isBanned)})
    });
    const response = await res.json();
    if (response && response.success) {
      setScores(response.scores)
    }
  }
  const handleLogout=()=>{
    localStorage.removeItem("auth-token")
    setIsAuthenticated(false)
  }
  return (
    <div className="w-full px-[5%] py-8 mt-8">
    <button className="absolute top-2 right-2 text-lg font-medium bg-red-500 text-white py-2 px-4 rounded" onClick={handleLogout}>Logout</button>

      <div className="bg-slate-100 p-4 rounded">
        <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold mb-4">Partners</h2>
        <Link to="/admin/partners/add" className="px-4 py-2 text-white font-medium bg-blue-500 rounded text-lg">
          Add
        </Link>
        </div>
        <div className="h-full">
          <SimpleBar style={{ maxHeight: "500px" }}>
              <ReactSortable swap className="grid grid-cols-4 gap-2 w-full" list={partners} setList={setPartners} onEnd={(e)=>{
                console.log(e)
                console.log(partners[0].name)
              }}>
              {partners.map((p) => {
                return (
                  <div key={p._id} className="flex flex-col items-center px-4 py-3  rounded w-full mb-2 bg-slate-200 text-black flex items-center justify-between">
                    <div className="h-8">
                      <img
                        src={p.image}
                        alt=""
                        className="w-auto h-full mx-auto"
                      />
                    </div>
                    <span className="text-lg font-medium mt-3">{p.name}</span>
                    {/* <span>{p.tags.slice(0,20)}</span> */}
                    <div className="w-full flex flex-justify-between mt-4">
                    <div className="flex-grow">
                    <Link to={`/admin/partners/edit/${p._id}`} className="w-full">
                     <button className="px-4 py-2 bg-blue-500 text-white rounded flex-grow mr-2 w-full">
                        Edit
                      </button>
                     </Link></div> <button
                        onClick={() => {
                          handleDelete(p._id);
                        }}
                        className="px-4 py-2 border-2 border-red-500 text-red-500 rounded flex-grow ml-2 "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </ReactSortable>
          </SimpleBar>
        </div>
      </div>
      <div className="bg-slate-100 p-4 rounded mt-8">
        <h2 className="text-3xl font-semibold mb-4">Scoreboard</h2>
        <div className="h-full">
        <div className="w-full flex items-center px-4 py-2 rounded mb-2">
                <h3 className="text-lg font-semibold w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">Name</h3>
                <h3 className="text-lg font-semibold ml-[5%] min-w-[100px]">Score</h3>
                <h4 className="text-lg font-semibold ml-[5%]">Wallet Address</h4> 
              </div>
          <SimpleBar style={{ maxHeight: "500px" }}>
          
            {scores.map(sc=>{
              return <div className="w-full flex items-center px-4 py-2 rounded mb-2 bg-slate-200">
                <h3 className="text-lg w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{sc.name}</h3>
                <h3 className="text-base ml-[5%] min-w-[100px]">{sc.score}</h3>
                <div className="flex ml-[5%]"> <h4 className="text-base">{sc.walletAddress.slice(0,10)+"..."}</h4><button onClick={()=>{
                  navigator.clipboard.writeText(sc.walletAddress)
                }} className="px-2 py-1 bg-slate-500 text-white rounded ml-4">COPY</button></div>
                <button onClick={()=>{handleBan(sc._id,sc.isBanned)}} className= {`ml-auto rounded py-2 px-4 text-white bg-red-500 ${sc.isBanned && "bg-green-500"}`}>{sc.isBanned ? "Unban" : "Ban"}</button>
              </div>
            })}
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};
export default AdminHome;
