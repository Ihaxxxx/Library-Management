import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: any;
  full_name: string;
  email: string;
  joined_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetch(`${backendUrl}/user/getusers`);
        const response = await data.json();
        const formattedUsers = response
          .filter((user: any) => user.role === "member")
          .map((user: any) => (    
            {
            id: user.id,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            joined_at: new Date(user.created_at).toISOString().slice(0, 10),
          }
        ));
        setUsers(formattedUsers);
        setUserLoaded(true);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
    loadUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <>
      <Navbar></Navbar>
      {userLoaded && (
        <table className="w-[95%] mx-auto divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    User ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Joined At
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((person) => (
                  <tr key={person.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {person.full_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.joined_at}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={`users/${person.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View<span className="sr-only">, {person.full_name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      )}
    </>
  );
}

