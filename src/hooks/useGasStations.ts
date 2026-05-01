import { mockStations, Station } from '../data';

export const useGasStations = () => {
  
  const getCheapest = (): Station[] => {
    return [...mockStations].sort((a, b) => 
      parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
    );
  };

  const getNearest = (): Station[] => {
    return [...mockStations].sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );
  };

  return { getCheapest, getNearest, allStations: mockStations };
};