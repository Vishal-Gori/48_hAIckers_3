"use client";
import React, { useEffect, useState } from "react";

const job = ({ params }) => {
  const [job,setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const response = await fetch(`/api/job/${params.id}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    setJob(data);
    };

    if (job == null) {
      fetchJob();
    }
  }, []);


    return (
      <div className="flex flex-col items-center bg-gray-200">
        <div className="w-full">
          <div className="relative h-[550px] w-full overflow-hidden">
            <div className={`absolute inset-0`}>
              
              <div className="absolute inset-0 gradient-overlay"></div>
              <div className="absolute inset-0 flex flex-col justify-end w-fit pb-14 pl-10 pr-20">
                <div className="text-white text-left w-fit font-extrabold text-5xl p-2">
                  {job?.jobTitle}
                </div>
                <div className="text-white text-left p-3 w-fit font-extralight text-2xl">
                  {job?.jobDescription}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="content"
          className="flex flex-col items-center w-3/4 justify-center pt-9 pb-12 bg-white px-14 my-4 rounded-md"
        ></div>
      </div>
    );
  } 


export default job;