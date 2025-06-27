import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, organizationId } = await request.json();
    
    // Here you would integrate with your Django backend
    const response = await fetch(`${process.env.DJANGO_API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName,
        organization_id: organizationId 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
        message: 'Registration successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.detail || 'Registration failed'
      }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
