import { authContext } from "@/lib/store/auth-context";
import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";

function SignIn() {
  const { googleLoginHandler } = useContext(authContext);
  return (
    <main className="container max-w-2xl px-6 mx-auto">
      <h1 className="mb-6 text-6xl font-bold text-center">Welcome ✋</h1>
      <div className="flex flex-col overflow-hidden shadow-md shadow-slate-500  bg-slate-800 rounded-2xl">
        <div className="h-72">
          <img
            src="https://png.pngtree.com/png-clipart/20240907/original/pngtree-vector-of-business-finance-marketing-counting-money-during-work-hours-png-image_15957511.png"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4 ">
          <h3 className="text-2xl text-center">Please sign in to continue </h3>
          <button
            onClick={googleLoginHandler}
            className="flex self-start gap2 mt-6 p-4 mx-auto text-white align-middle bg-gray-700 rounded-xl"
          >
            <FcGoogle className="text-2xl" /> Google
          </button>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
