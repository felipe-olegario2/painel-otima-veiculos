import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    price: { type: Number, required: true },
    detail: { type: String, required: true },
    img: { type: [String], required: true },
    mainImg: { type: String, required: true },
    year: { type: Number, required: true },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String },
    mileage: { type: Number, required: true }, // Quilometragem
    transmission: { type: String, enum: ["Automático", "Manual"], required: true }, // Câmbio
    fuel: { type: String, enum: ["Flex", "Gasolina", "Etanol", "Diesel"], required: true }, // Combustível
    licensePlateEnd: { type: Number, min: 0, max: 9, required: true }, // Final da placa
    doors: { type: Number, required: true }, // Número de portas
    options: { type: [String], default: [] }, // Opcionais do carro
    sold: { type: Boolean, default: false }, // Indica se o carro foi vendido
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

export default mongoose.models.Car || mongoose.model("Car", CarSchema);
