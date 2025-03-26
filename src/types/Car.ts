export interface Car {
    _id: string;
    model: string;
    mainImg: string;
    price: number;
    detail: string;
    color: string;
    img: string[];
    year: number;
    brand: string;
    description?: string;
    mileage?: number;
    transmission?: string;
    fuel?: string;
    licensePlateEnd?: number;
    doors?: number;
    options?: string[];
    createdAt?: string;
  }
  