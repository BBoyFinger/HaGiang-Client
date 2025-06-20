import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDestinationById, Destination } from "@/api/destinations";

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    if (id) {
      fetchDestinationById(Number(id)).then((data) => {
        if (data) setDestination(data);
      });
    }
  }, [id]);

  if (!destination) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">{destination.name}</h2>
      <p className="text-gray-700">{destination.description}</p>
    </div>
  );
}
