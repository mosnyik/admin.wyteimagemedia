"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import PaystackPop from "@paystack/inline-js";

type paystackPaymentType = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    function toKobo(amount: number | string): number {
      return Math.round(Number(amount) * 100);
    }

    try {
      const response = await fetch("/api/paystack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "name sample",
          email: "customer@email.com",
          amount: toKobo(25000),
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate payment");

      const data: paystackPaymentType = await response.json();
      const accessCode = data.data.access_code;
      const reference = data.data.reference;

      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess(tranx) {
          console.log(`transaction succeeded ${tranx}`);
          window.location.replace(`http://localhost:3000/?${reference}`);
        },
        onCancel() {
          console.log("Payment canceled");
        },
        onError(error) {
          console.log(`Error occured ${error}`);
        },
      });
    } catch (error) {
      console.log({ error });
      setLoading(false);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-xl font-semibold">Your Items</h1>

            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Premium Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    1 month access
                  </p>
                </div>
                <span>₦12,000</span>
              </li>

              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Service Fee</p>
                  <p className="text-sm text-muted-foreground">
                    Processing & support
                  </p>
                </div>
                <span>₦3,000</span>
              </li>
            </ul>

            <Button
              onClick={handleCheckout}
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? "Processing…" : "Proceed to Pay"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
