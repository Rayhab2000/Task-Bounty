import { NextResponse } from 'next/server';
import { taskSchema } from '@/lib/taskValidation';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    // Aquí iría la lógica de interacción con el cliente RPC de Stellar/Soroban
    return NextResponse.json(
      { message: 'Task created successfully', data: validatedData },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
