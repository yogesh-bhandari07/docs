"use client";
import Sidebar from "@/components/user/Sidebar";
import Editor from "@/components/user/Editor";
import { use, useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import ApiTester from "@/components/user/ApiTester";
import { headers } from "next/headers";
export default async function Home() {
  const requestHeaders = await headers();
  const slugOfProject = requestHeaders.get("slugOfProject") || "No Subdomain";
  const [project, setProject]: any = useState([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedPageDetails, setSelectedPageDetails] = useState<any>(null);
  const [setPageApiData, setSetPageApiData] = useState<any>(null);

  useEffect(() => {
    console.log("Slug:", slugOfProject);

    const fetchProject = async () => {
      try {
        const response = await apiRequest(
          `get-project/${slugOfProject}`,
          "GET",
          null,
          false
        );
        if (response) {
          setProject(response);
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
          `get-page/${selectedPage._id}`,
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

  return (
    <div className="flex h-screen">
      <Sidebar project_id={project?.id} onPageSelect={setSelectedPage} />

      <div className="flex-1 flex flex-col">
        <nav className="p-4 bg-gray-900 text-white shadow-md flex items-center">
          <h1 className="text-xl font-bold">{slugOfProject}</h1>
        </nav>

        <div className="flex flex-1 p-4 gap-4">
          <div className="flex-1 bg-white shadow-md p-4 rounded-lg">
            {selectedPage ? (
              <Editor page={selectedPageDetails} />
            ) : (
              <p>Select a page to edit...</p>
            )}
          </div>

          <div className="bg-gray-100 shadow-md rounded-lg">
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
