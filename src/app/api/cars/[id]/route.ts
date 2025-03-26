import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";

// GET - Busca um carro por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    console.log('aqui', params.id);
    const car = await Car.findById(params.id);
    if (!car) {
      return NextResponse.json({ message: "Carro não encontrado" }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar carro" }, { status: 500 });
  }
}
