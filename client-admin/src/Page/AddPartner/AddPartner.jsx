import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPartnerForm from "../../components/AddPartnerForm";
import { useAdminAuthContext } from "../../context/AdminAuthContext";
const AddPartner=()=>{
    const {SERVER_URL,setPartners}= useAdminAuthContext()
    const [formData,setFormData] = useState({name:"",tags:"",twitterLink:"",websiteLink:""})
const [partnerImage,setPartnerImage]= useState(null)
const [isFetching,setIsFetching]= useState(false)
const navigate=useNavigate()
    const handleSubmit=async (e)=>{
        e.preventDefault()
        if(isFetching)return;
        setIsFetching(true)
        console.log(formData);
        const finalData = new FormData();
        finalData.append("partner-image", partnerImage);
        finalData.append("name", formData.name);
        finalData.append("tags", formData.tags);
        finalData.append("twitter", formData.twitterLink);
        finalData.append("website", formData.websiteLink);
        const res = await fetch(SERVER_URL+"/admin/partners", {
          method: "POST",
          body: finalData,
        });
        const response = await res.json();
        if(response && response.success){

            setPartners(response.partners)
            return navigate("/admin")
        }
        setIsFetching(false)
        alert("Some error occurred!")
    }
   return( <div className="w-full pt-8">
    <h1 className="w-full text-2xl text-center mb-6 font-bold text-slate-700">Add a partner</h1>
        <AddPartnerForm onSubmit={handleSubmit}  isFetching={isFetching} formData={formData} setFormData={setFormData}  partnerImage={partnerImage} setPartnerImage={setPartnerImage} />
    </div>)
}
export default AddPartner