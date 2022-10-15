import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
const EditPartnerForm= ({onSubmit,formData,setFormData,partnerImage,setPartnerImage,isFetching})=>{
  if(!formData){
    return ""
  }
    const handleChange=(data)=>{
        setFormData((prev) => ({
            ...prev,
            ...data
          }));
    }
    
    const imageInput = useRef(null)

        return(
        <div class="w-full max-w-sm mx-auto">
          <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={onSubmit}
          >
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
               Partner Name
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder=""
                value={formData.name}
                onChange={(e) => {
                  handleChange({name:e.target.value})
                }}
              />
            </div> 
             <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
               Twitter Profile Link
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder=""
                value={formData.twitter}
                onChange={(e) => {
                  handleChange({twitter:e.target.value})
                }}
              />
            </div>
             <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
               Website Link
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder=""
                value={formData.website}
                onChange={(e) => {
                  handleChange({website:e.target.value})
                }}
              />
            </div>
             <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
               Tags
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Separated with commas"
                value={formData.tags}
                onChange={(e) => {
                  handleChange({tags:e.target.value})
                }}
              />
            </div>
            

      
            <div class="flex items-center justify-center w-full">
              <button
                class="mr-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isFetching ?"Saving" :"Edit"}
              </button>
              <Link to="/admin"
                class="ml-2 border border-red-500 text-red-500 text-center   w-full bg-transparent  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </Link>
          
            </div>
          </form>
        </div>
        )
}
export default EditPartnerForm