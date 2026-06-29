

export const getDepartments = async (): Promise<string[]> => {
  const response = await fetch("/datas/departments.json");

  if (!response.ok) {
    throw new Error("Bölüm listesi alınamadı");
  }

  const data: string[] = await response.json();

  return data;
};

