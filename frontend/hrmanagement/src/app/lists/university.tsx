export type University = {
  name: string;
  country: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  "state-province": string | null;
};  


export const getUniversities = async (): Promise<University[]> => {
  const response = await fetch("/datas/university.json");

  if (!response.ok) {
    throw new Error("Üniversite listesi alınamadı");
  }

  const data: University[] = await response.json();

  return data;
};

