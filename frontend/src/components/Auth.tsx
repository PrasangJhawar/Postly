import { useState, type ChangeEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { SignupInput } from '@prasangjhawar/medium-common1'
import axios from "axios";
import { BACKEND_URL } from '../config';

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

    const [postInputs, setPostInputs] = useState<SignupInput>({
        email: "",
        password:"",
        name:""
    })


    async function sendRequest() {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup" ? "signup" : "signin"}`, postInputs)
        const jwt = response.data.jwt;
        sessionStorage.setItem("token", jwt);
        navigate("/blogs");
      } catch (error: any) {
        console.error("Error during auth request:", error.response?.data || error.message);
        alert("Error while signing up. Try Again")
      }
    }


  return (
    <div className='h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='px-10'>

            <div className='text-3xl font-bold sm-4'>
            Create an account
            </div>
            <div className='text-slate-400'>
              {type === "signin" ? "Don't have an account?":"Already have an account?" }
            
              <Link className='pl-2 underline' to={ type === "signin" ? "/signup" : "/signin"}>
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
        </div>
        <div className='pt-7'>
          <LabelledInput label="Email" placeholder="jensenhuang@nvidia.com" onChange={(e) => {
            setPostInputs({ 
                ...postInputs,
                email: e.target.value
            })
          }} />
          <LabelledInput label="Password" type="password" placeholder="123456" onChange={(e) => {
            setPostInputs({ 
                ...postInputs,
                password: e.target.value
            })
          }} />

          {type === "signup" ?  <LabelledInput label="Username" placeholder="Jensen Huang..." onChange={(e) => {
            setPostInputs({ 
                ...postInputs,
                name: e.target.value
            })
          }} /> : null}
        </div>
<button
  onClick={sendRequest}
  type="button"
  className="mt-10 text-white bg-gray-900 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer"
>
  {type === "signup" ? "Sign up" : "Sign in"}
</button>

        
       
      </div>
    </div>
  )
}

interface labelledInputType {
  label?: string;
  title?: string;
  type?: string;
  placeholder: string;
  onChange: (e: any) => void;
}

// Keep function name capitalized to use it as a component
function LabelledInput({ label , placeholder, onChange, type }: labelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black pt-5">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  )
}

export default Auth
