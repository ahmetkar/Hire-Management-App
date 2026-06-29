export type City = {
  id:number,
  name:string,
  plateCode:string
};  


export const getCities = async (): Promise<City[]> => {
  const response = await fetch("/datas/cities.json");

  if (!response.ok) {
    throw new Error("Şehirr listesi alınamadı");
  }

  const data: City[] = await response.json();

  return data;
};

