import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import cookieClearer from "../utils/cookieClear.ts";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LoginPage() {
  const [responseStatus, setResponseStatus] = useState<boolean>(true)
    const navigate = useNavigate();

    useEffect(() => {
        cookieClearer()
    }, [])

    async function loginUser(formData: any) {
        'use server'
        const email = formData.get('email')
        const password = formData.get('password')
        if (email != "" && password != "") {
            let data = await fetch(`${backendUrl}/user/loginuser`, {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            let response = await data.json()
            console.log(response);
            if (!response.success) {
                setResponseStatus(false)
            } else {
                navigate('/home');
                // alert("meow")
            }
        } else {
            alert("Something went wrong")
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-700">
            <h2 className="text-3xl font-extrabold text-white text-center">Login Admin</h2>

            <form action={loginUser} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        className="block w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                        Password
                    </label>
                    <input
                        required
                        type="password"
                        id="password"
                        name="password"
                        className="block w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Log In
                </button>
            </form>

            {responseStatus === false && (
                <p className="text-sm text-center text-red-400 mt-2">Invalid credentials. Please try again.</p>
            )}

            <p className="text-sm text-center text-gray-400">
                Don’t have an account?{" "}
                <a href="/registeradmin" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Log In →
                </a>
            </p>
        </div>
    </div>
)

}

export default LoginPage