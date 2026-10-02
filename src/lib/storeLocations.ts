export type StoreLocation = {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  locationUrl: string;
  mapPosition: { left: string; top: string };
};

export const storeLocations: StoreLocation[] = [
  { id: 'zamalek', name: 'The Main Stays – Zamalek', city: 'Cairo, Egypt', address: '15 Ahmed Heshmat Street, Zamalek', hours: 'Open today · 9am–10pm', phone: '+20 10 1234 5678', locationUrl: 'https://www.google.com/maps/search/?api=1&query=15%20Ahmed%20Heshmat%20Street%20Zamalek%20Cairo%20Egypt', mapPosition: { left: '46%', top: '39%' } },
  { id: 'new-cairo', name: 'The Main Stays – New Cairo', city: 'New Cairo, Egypt', address: '90th Street, New Cairo', hours: 'Open today · 9am–11pm', phone: '+20 11 2345 6789', locationUrl: 'https://www.google.com/maps/search/?api=1&query=90th%20Street%20New%20Cairo%20Egypt', mapPosition: { left: '52%', top: '44%' } },
  { id: 'maadi', name: 'The Main Stays – Maadi', city: 'Maadi, Cairo', address: 'Road 9, Maadi', hours: 'Open today · 9am–10pm', phone: '+20 12 3456 7890', locationUrl: 'https://www.google.com/maps/search/?api=1&query=Road%209%20Maadi%20Cairo%20Egypt', mapPosition: { left: '48%', top: '48%' } },
  { id: 'alexandria', name: 'The Main Stays – Alexandria', city: 'Alexandria, Egypt', address: 'San Stefano, Alexandria', hours: 'Open today · 10am–11pm', phone: '+20 15 4567 8901', locationUrl: 'https://www.google.com/maps/search/?api=1&query=San%20Stefano%20Alexandria%20Egypt', mapPosition: { left: '36%', top: '25%' } },
  { id: 'giza', name: 'The Main Stays – Giza', city: 'Giza, Egypt', address: '26 July Street, Giza', hours: 'Open today · 9am–10pm', phone: '+20 10 5678 9012', locationUrl: 'https://www.google.com/maps/search/?api=1&query=26%20July%20Street%20Giza%20Egypt', mapPosition: { left: '43%', top: '40%' } },
  { id: 'sheikh-zayed', name: 'The Main Stays – Sheikh Zayed', city: 'Sheikh Zayed, Egypt', address: 'Zayed Central, Sheikh Zayed, Giza', hours: 'Open today · 9am–11pm', phone: '+20 11 6789 0123', locationUrl: 'https://www.google.com/maps/search/?api=1&query=Zayed%20Central%20Sheikh%20Zayed%20Giza%20Egypt', mapPosition: { left: '39%', top: '37%' } },
  { id: 'mansoura', name: 'The Main Stays – Mansoura', city: 'Mansoura, Egypt', address: 'El Gomhoria Street, Mansoura', hours: 'Open today · 9am–10pm', phone: '+20 12 7890 1234', locationUrl: 'https://www.google.com/maps/search/?api=1&query=El%20Gomhoria%20Street%20Mansoura%20Egypt', mapPosition: { left: '51%', top: '28%' } },
  { id: 'tanta', name: 'The Main Stays – Tanta', city: 'Tanta, Egypt', address: 'El Bahr Street, Tanta', hours: 'Open today · 9am–10pm', phone: '+20 10 7890 1234', locationUrl: 'https://www.google.com/maps/search/?api=1&query=El%20Bahr%20Street%20Tanta%20Egypt', mapPosition: { left: '45%', top: '30%' } },
  { id: 'hurghada', name: 'The Main Stays – Hurghada', city: 'Hurghada, Egypt', address: 'Sheraton Road, Hurghada', hours: 'Open today · 10am–11pm', phone: '+20 15 8901 2345', locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sheraton%20Road%20Hurghada%20Egypt', mapPosition: { left: '59%', top: '67%' } },
  { id: 'sharm-el-sheikh', name: 'The Main Stays – Sharm El Sheikh', city: 'Sharm El Sheikh, Egypt', address: 'Naama Bay, Sharm El Sheikh', hours: 'Open today · 10am–11pm', phone: '+20 10 9012 3456', locationUrl: 'https://www.google.com/maps/search/?api=1&query=Naama%20Bay%20Sharm%20El%20Sheikh%20Egypt', mapPosition: { left: '69%', top: '76%' } },
];
