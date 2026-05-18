export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  openNow: boolean;
}

export const stores: Store[] = [
  {
    id: "s1",
    name: "Jan-Aushadhi Kendra - Sector 1",
    address: "B-24, Market Road, Sector 1, Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    phone: "080-12345678",
    openNow: true
  },
  {
    id: "s2",
    name: "Jan-Aushadhi Store - Koramangala",
    address: "4th Block, Koramangala, Opposite Water Tank, Bangalore",
    lat: 12.9352,
    lng: 77.6245,
    phone: "080-87654321",
    openNow: false
  },
  {
    id: "s3",
    name: "Kendra - Indiranagar",
    address: "12th Main Road, HAL 2nd Stage, Bangalore",
    lat: 12.9719,
    lng: 77.6412,
    phone: "080-23456789",
    openNow: true
  },
  {
    id: "s4",
    name: "Government Generic Outlet - MG Road",
    address: "MG Road Metro Station Complex, Bangalore",
    lat: 12.9750,
    lng: 77.6070,
    phone: "080-34567890",
    openNow: true
  }
];
