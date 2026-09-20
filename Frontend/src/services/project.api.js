import api from "./api";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const getMyProjects = async () => {
  const response = await api.get("/projects/my-projects");
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const createJoinRequest = async (projectId, message) => {
  const response = await api.post(
    `/projects/${projectId}/requests`,
    {
      message
    }
  );

  return response.data;
};





