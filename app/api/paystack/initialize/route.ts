const allowedOrigins = [
  "https://app.example.com",
  "https://admin.example.com",
  "http://localhost:5173/",
];

function getCorsHeaders(req: Request): HeadersInit | undefined {
  // get the originating url
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  // meaning we do not have an allowed url
  return undefined;
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: body.email, amount: body.amount }),
      }
    );

    const data = await response.json();
    return Response.json(data, {
      status: response.ok ? 200 : response.status,
    });
  } catch (err) {
    console.log(`An error occured: ${err}`);
    return Response.json(
      { data: null, error: "Failed to initialize transaction" },
      { status: 200 }
    );
  }
}
