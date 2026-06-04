import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import axios from 'axios'
import { serverUrl } from '../App.jsx'

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/getcurrentuser` , {withCredentials: true});
            dispatch(setUserData(response.data));
        } catch (error) {
            console.error("Error fetching user:", error);
            dispatch(setUserData(null));
        }
    };
    // Bhai logout karte waqt dispatch(setUserData(null)) hota hai — toh useGetCurrentUser dubara call nahi hota page reload ke bina! isliye use Effect use kiya
    fetchUser();
  }, []);

  return null;
};

export default useGetCurrentUser



// Bhai iska main kaam hai:

// 👉 Jab user website reload kare ya direct URL open kare, tab logged-in user ka data wapas Redux me laana.

// Example:

// User login karta hai ✅
// User data Redux me save ho jata hai ✅
// Ab page refresh kar diya ❌

// Refresh ke baad Redux ka sara data clear ho jata hai.

// Tab ye hook: