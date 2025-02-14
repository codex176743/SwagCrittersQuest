export const getFileUrl = async (imageUrl: string) => {
  const formData = new FormData();
  const base64Response = await fetch(imageUrl);
  const newBlob = await base64Response.blob();
  formData.append("file", newBlob);
  const response = await fetch("/api/pinata/files", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

export const getJsonUrl = async (jsonData: any) => {
  const response = await fetch("/api/pinata/json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  return await response.json();
};
