import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import cookieClearer from "../utils/cookieClear.ts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function RegisterAdminPage() {
  const [responseStatus, setResponseStatus] = useState<boolean>(true)
  const navigate = useNavigate();

  useEffect(() => {
    cookieClearer()
  }, [])

  async function SignUpUser(formData: any) {
    'use server'
    const firstname = formData.get('firstname')
    const lastname = formData.get('lastname')
    const email = formData.get('email')
    const password = formData.get('password')
    if (firstname != "" && lastname != "" && email != "" && password != "") {
      let data = await fetch(`${backendUrl}/user/createuser`, {
        method: "POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstname,
          lastname,
          password
        })
      })
      if (data.status == 201) {
        navigate('/dashboard');
      } else if (data.status == 400) {
        setResponseStatus(false)
      } else if (data.status == 500) {
        setResponseStatus(false)
      }
    } else {
      alert("Enter all details")
    }
  }

  return (<>
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>

        <form action={SignUpUser} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 shadow-sm text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              required
              type="text"
              id="firstname"
              name="firstname"
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 shadow-sm text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              required
              type="text"
              id="lastname"
              name="lastname"
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 shadow-sm text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 shadow-sm text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>

        {responseStatus === false && (
          <p className="text-sm text-red-500 text-center">Something went wrong</p>
        )}

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/" className="font-medium text-indigo-400 hover:text-indigo-300">
            Log in →
          </a>
        </p>
      </div>
    </div>

  </>
  );

}