import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Here you would integrate with your Django backend
    const response = await fetch(`${process.env.DJANGO_API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.detail || 'Login failed'
      }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
