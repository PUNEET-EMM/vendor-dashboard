import { Routes, Route } from "react-router-dom";



export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div />} />
      <Route path="/login" element={<div/>} />
    </Routes>
  );
}