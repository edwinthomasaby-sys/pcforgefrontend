import Api from "./Api";

export const getComponents = async (params = {}) => {
  const response = await Api.get("/components", { params });
  return response.data;
};

export const getComponentById = async (id) => {
  const response = await Api.get(`/components/${id}`);
  return response.data;
};