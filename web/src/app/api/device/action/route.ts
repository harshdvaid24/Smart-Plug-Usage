import { NextResponse } from "next/server";

const POLLER_API_URL = "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${POLLER_API_URL}/api/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Poller API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to proxy action to poller:", error);
    return NextResponse.json(
      { error: "Failed to communicate with device poller" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${POLLER_API_URL}/api/status`);
    if (!response.ok) {
      throw new Error(`Poller API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to proxy status to poller:", error);
    return NextResponse.json(
      { error: "Failed to fetch device status" },
      { status: 500 }
    );
  }
}
