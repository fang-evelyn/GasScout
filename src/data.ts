// Define the interface so both files know the shape of the data
export interface Station {
  id: string;
  name: string;
  distance: string;
  price: string;
  lastUpdated: string;
  tags: string[];
  lat: number;
  lng: number;
  membersOnly?: boolean;
}

export 
const mockStations: Station[] = [
  {
    id: '1',
    name: 'Costco Gas',
    distance: '2.1 mi',
    price: '$3.15',
    lastUpdated: '5 min ago',
    tags: ['Members only', 'Top Tier'],
    lat: 31.7742,
    lng: -106.3942,
    membersOnly: true,
  },
  {
    id: '2',
    name: 'Shell Gas Station',
    distance: '0.8 mi',
    price: '$3.45',
    lastUpdated: '12 min ago',
    tags: ['Restroom', 'Car Wash'],
    lat: 31.7749,
    lng: -106.4950,
  },
  {
    id: '3',
    name: 'Chevron',
    distance: '1.2 mi',
    price: '$3.52',
    lastUpdated: '8 min ago',
    tags: ['24/7', 'Store'],
    lat: 31.7800,
    lng: -106.5100,
  },
  {
    id: '4',
    name: "Sam's Club Fuel",
    distance: '2.5 mi',
    price: '$3.12',
    lastUpdated: '2 min ago',
    tags: ['Members only', 'Fast Pay'],
    lat: 31.7730,
    lng: -106.3790,
    membersOnly: true,
  },
  {
    id: '5',
    name: 'Love\'s Travel Stop',
    distance: '12.4 mi',
    price: '$3.39',
    lastUpdated: '45 min ago',
    tags: ['Showers', 'Truck Parking', '24/7'],
    lat: 31.6780,
    lng: -106.2410,
  },
  {
    id: '6',
    name: 'Speedway',
    distance: '1.1 mi',
    price: '$3.28',
    lastUpdated: '10 min ago',
    tags: ['Convenience Store'],
    lat: 31.7710,
    lng: -106.3850,
  },
  {
    id: '7',
    name: 'Circle K',
    distance: '3.4 mi',
    price: '$3.34',
    lastUpdated: '15 min ago',
    tags: ['Coffee', 'Snacks'],
    lat: 31.8480,
    lng: -106.5410,
  },
  {
    id: '8',
    name: '7-Eleven',
    distance: '0.5 mi',
    price: '$3.41',
    lastUpdated: '22 min ago',
    tags: ['Propane', 'Atm'],
    lat: 31.7680,
    lng: -106.4890,
  },
  {
    id: '9',
    name: 'Valero',
    distance: '4.2 mi',
    price: '$3.31',
    lastUpdated: '31 min ago',
    tags: ['Easy Access'],
    lat: 31.7510,
    lng: -106.3200,
  },
  {
    id: '10',
    name: 'Murphy USA',
    distance: '5.8 mi',
    price: '$3.19',
    lastUpdated: '6 min ago',
    tags: ['Near Walmart'],
    lat: 31.7380,
    lng: -106.2950,
  },
  {
    id: '11',
    name: 'Exxon',
    distance: '2.9 mi',
    price: '$3.49',
    lastUpdated: '19 min ago',
    tags: ['Rewards'],
    lat: 31.8150,
    lng: -106.4300,
  },
  {
    id: '12',
    name: 'Marathon',
    distance: '7.1 mi',
    price: '$3.25',
    lastUpdated: '14 min ago',
    tags: ['Diesel'],
    lat: 31.7100,
    lng: -106.2100,
  },
  {
    id: '13',
    name: 'Western Refining',
    distance: '1.9 mi',
    price: '$3.37',
    lastUpdated: '11 min ago',
    tags: ['Local'],
    lat: 31.7700,
    lng: -106.4550,
  },
];