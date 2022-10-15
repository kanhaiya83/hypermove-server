import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddPartnerForm from "../../components/AddPartnerForm";
import { useAdminAuthContext } from "../../context/AdminAuthContext";
import EditPartnerForm from "./EditPartnerForm";
const EditPartner=()=>{
    const {SERVER_URL,partners,setPartners}= useAdminAuthContext()
    const [formData,setFormData] = useState(null)
    const params = useParams()
    useEffect(()=>{
        if(Boolean(formData))return;
        const foundPartner = partners.find(p=>{
            return p._id === params.id
        })
        setFormData(foundPartner)
    },[])
// const [partnerImage,setPartnerImage]= useState(null)
const [isFetching,setIsFetching]= useState(false)
const navigate=useNavigate()
    const handleSubmit=async (e)=>{
        e.preventDefault()
        if(isFetching)return;
        setIsFetching(true)
        console.log({formData});
        const res = await fetch(SERVER_URL+"/admin/partners/"+formData._id, {
          method: "PATCH",
          body: JSON.stringify(formData),
            headers: { "auth-token": localStorage.getItem("auth-token"),"Content-Type":"application/json" }
        });
        const response = await res.json();
        if(response && response.success){
            setPartners(response.partners)
        setIsFetching(false)

            return navigate("/admin")
        }
        setIsFetching(false)
        alert("Some error occurred!")
    }
   return( <div className="w-full pt-8">
        <EditPartnerForm onSubmit={handleSubmit}  isFetching={isFetching} formData={formData} setFormData={setFormData}  partnerImage={null} setPartnerImage={()=>{}} />
    </div>)
}
export default EditPartner