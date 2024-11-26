import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import  schoolImg from "./images/school.jpeg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App= () => {
  const { register, handleSubmit, reset } = useForm();
  const [students, setStudents] = useState([]);

  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/students");
        setStudents(response.data);
      } catch (error) {
        toast.error("Failed to fetch students");
      }
    };
    fetchStudents();
  }, []);

  // Submit new student data
  const onSubmit = async (data) => {
    try {
      // Format JSON fields
      data.units_registered = JSON.parse(data.units_registered);
      data.exam_scores = JSON.parse(data.exam_scores);
      data.grades = JSON.parse(data.grades);

      await axios.post("http://localhost:3000/api/students", data);
      toast.success("Student added successfully");
      reset(); // Clear form fields
    } catch (error) {
      toast.error("Failed to add student");
    }
  };

  return (
    <main  className="h-full bg-cover bg-center bg-slate-600 py-20 " style={{ backgroundImage: `url(${schoolImg})`}}>
<section>

            <h1 
            className="font-bold md:text-4xl text-center underline md:my-5" >Student Management</h1>

            <p className=" py-4 text-center" >Key in Student details</p>


      <form onSubmit={handleSubmit(onSubmit)} className=" bg-white border  p-4 flex flex-col shadow-lg lg:m-auto w-full md:w-1/2">
        <input
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("full_name", { required: true })}
          placeholder="Full Name"
        />
        <input
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("registration_number", { required: true })}
          placeholder="Registration Number"
        />
        <input
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("fees_paid", { required: true })}
          type="number"
          step="0.01"
          placeholder="Fees Paid"
        />
        <input
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("fees_balance", { required: true })}
          type="number"
          step="0.01"
          placeholder="Fees Balance"
        />
        <textarea
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("units_registered", { required: true })}
          placeholder='Units Registered (e.g., ["Math", "Physics"])'
        ></textarea>
        <textarea
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("exam_scores", { required: true })}
          placeholder='Exam Scores (e.g., {"Math": 85, "Physics": 90})'
        ></textarea>
        <textarea
        className="border border-slate-950 p-2 my-2 rounded"
          {...register("grades", { required: true })}
          placeholder='Grades (e.g., {"Math": "A", "Physics": "A"})'
        ></textarea>
        <button type="submit" className="border border-slate-950 p-2 my-2 rounded bg-green-500 text-black font-bold text-2xl">Add Student</button>
      </form>


</section>
<section className="h-screen mt-10">


      <h2 className="font-bold text-4xl text-center underline my-5 bg-white p-3" >Student List</h2>
      <p className="text-center bg-white">List of students</p>
      <ol className="m-5 shadow-lg" >
        {students.map((student) => (
          <li className="border p-3 bg-white m-2 text-center" key={student.id}>
            {student.full_name} 
            ({student.registration_number})
          </li>
        ))}
      </ol>
      </section>
      <ToastContainer
      position="top-center" 
      />
      </main>

  );
};

export default App;
