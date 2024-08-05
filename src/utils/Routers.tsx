import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "@/pages/Profile";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Dispute from "@/pages/Dispute"; 
import Awards from "@/pages/Awards"; 

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: '/profile',
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
      <Navbar/>
      <Dashboard/>
      </>
    )
  },
  {
    path: "/disputes",
    element: (
      <>
        <Navbar />
        <Dispute />
      </>
    ),
  },
  {
    path: "/awards",
    element: (
      <>
        <Navbar />
        <Awards />
      </>
    ),
  },
]);
