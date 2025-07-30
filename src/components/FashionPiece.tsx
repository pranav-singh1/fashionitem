import React, { useEffect, useState } from "react";
import { fetchFashionPiece } from "../utils/fetchFashionPiece.ts";

type FashionPieceType = {
  brand: string;
  designer: string;
  category: string;
  color: string;
  description: string;
};

export default function FashionPiece() {
  const [piece, setPiece] = useState(null);

  useEffect(() => {
    fetchFashionPiece(new Date().toISOString().slice(0, 10)).then(piece => {
      console.log("Fetched piece:", piece);
      setPiece(piece);
    });
  }, []);

  if (!piece) return <div>Loading...</div>;

  return (
    <div>
      <h2>{piece.brand}</h2>
      <p>Designer: {piece.designer}</p>
      <p>Category: {piece.category}</p>
      <p>Color: {piece.color}</p>
      <p>{piece.description}</p>
    </div>
  );
}