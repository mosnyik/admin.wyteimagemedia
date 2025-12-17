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
