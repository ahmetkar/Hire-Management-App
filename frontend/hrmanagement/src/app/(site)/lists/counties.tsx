export type County = {
  ilce_id:number,
  il_plaka:number,
  ilce_adi:string
};  






export const getCounties = async (plaka : Number): Promise<County[]> => {

  
  const response = await fetch("/datas/counties.json",{cache:"no-store"});
  
  if (!response.ok) {
    throw new Error("İlçe listesi alınamadı");
  }

  const data: County[] = await response.json();

  const filteredData = data.filter((county)=>county.il_plaka == plaka)

  return filteredData;
};

