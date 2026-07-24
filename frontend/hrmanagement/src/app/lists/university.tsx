export type University = {
  isim: string;

};  


export const getUniversities = async (): Promise<University[]> => {
  const response = await fetch("/datas/university.json");

  if (!response.ok) {
    throw new Error("Üniversite listesi alınamadı");
  }

  const data: University[] = await response.json();

  return data;
};

