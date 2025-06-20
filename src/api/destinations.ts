import axios from "axios";

export interface Destination {
  id: number;
  name: string;
  description: string;
}

export async function fetchDestinations(): Promise<Destination[]> {
  // Fake API using mock data
  return Promise.resolve([
    { id: 1, name: "Đèo Mã Pí Lèng", description: "Một trong tứ đại đỉnh đèo nổi tiếng của Việt Nam." },
    { id: 2, name: "Dinh Vua Mèo", description: "Di tích lịch sử nổi bật ở Đồng Văn." },
  ]);
}

export async function fetchDestinationById(id: number): Promise<Destination | undefined> {
  const data = await fetchDestinations();
  return data.find((d) => d.id === id);
}
