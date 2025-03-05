"use client";
import Sidebar from "@/components/user/Sidebar";
import Editor from "@/components/user/Editor";
import { use, useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import ApiTester from "@/components/user/ApiTester";
const Cookies = require("js-cookie");
export default function Home() {
  const [project, setProject]: any = useState([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedPageDetails, setSelectedPageDetails] = useState<any>(null);
  const [setPageApiData, setSetPageApiData] = useState<any>(null);
  const [slugOfProject, setSlugOfProject] = useState("");

  useEffect(() => {
    const subdomain = Cookies.get("subdomain");
    setSlugOfProject(subdomain);
  }, []);

  useEffect(() => {
    console.log("Slug:", slugOfProject);

    const fetchProject = async () => {
      try {
        const response = await apiRequest(
          `user/get-project/${slugOfProject}`,
          "GET",
          null,
          false
        );
        if (response) {
          setProject(response?.project);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [slugOfProject]);

  useEffect(() => {
    console.log("Selected Page:", selectedPage);

    const getPageData = async () => {
      if (!selectedPage) {
        return;
      }
      try {
        const response = await apiRequest(
          `user/get-page/${selectedPage._id}`,
          "GET",
          null,
          false
        );
        if (response) {
          setSelectedPageDetails(response);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    };

    getPageData();
  }, [selectedPage]);

  useEffect(() => {
    if (!selectedPage) {
      return;
    }
    if (selectedPageDetails?.apis?.length > 0) {
      const apiData = selectedPageDetails.apis[0];
      setSetPageApiData({
        url: apiData.url || "",
        method: apiData.method || "GET",
        headers: apiData.headers || [{ key: "", value: "" }],
        params: apiData.params || [{ key: "", value: "" }],
        body: apiData.body || [{ key: "", value: "" }],
        sample: apiData.sample || null,
      });
    }
  }, [selectedPage]);

  console.log("Selected Page Details:", project);
  return (
    <div className="flex h-screen">
      <Sidebar project_id={project?._id} onPageSelect={setSelectedPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="p-4 bg-gray-900 text-white shadow-md flex items-center">
          <h1 className="text-xl font-bold">{slugOfProject}</h1>
        </nav>

        <div className="flex flex-1 p-4 gap-4 ">
          <div className="flex-1 bg-white shadow-md p-4 rounded-lg overflow-y-auto h-[90%]">
            {selectedPage ? (
              <Editor page={selectedPageDetails} />
            ) : (
              <p>Select a page to edit...</p>
            )}
          </div>

          <div className="bg-gray-100 shadow-md rounded-lg overflow-y-auto h-[90%]">
            <ApiTester
              page={selectedPageDetails?.page}
              api={selectedPageDetails?.apis[0] ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
