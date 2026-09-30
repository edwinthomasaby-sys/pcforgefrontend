import Api from "./Api";

export const getBuilds = async (params = {}) => {
  const response = await Api.get("/builds", { params });

  return {
    data: response.data,
    total: Number(response.headers["x-total-count"] || response.data.length)
  };
};

export const getBuildById = async (id) => {
  const response = await Api.get(`/builds/${id}`);
  return response.data;
};

export const createBuild = async (build) => {
  const response = await Api.post("/builds", build);
  return response.data;
};

export const updateBuild = async (id, build) => {
  const response = await Api.put(`/builds/${id}`, build);
  return response.data;
};

export const deleteBuild = async (id) => {
  await Api.delete(`/builds/${id}`);
};