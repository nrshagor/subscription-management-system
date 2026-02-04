import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { VendorType } from "../types/vendorType";
import type { PlanType } from "../types/planType";
import { apiFetch } from "../services/api";

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch(`/vendors/${id}/plans`).then((data) => {
      setVendor(data.vendor);
      setPlans(data.plans);
    });
  }, [id]);

  const purchasePlan = async (planId: number) => {
    try {
      await apiFetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });
      setMessage("Subscription purchased successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{vendor?.name} Plans</h1>
      {message && <p className="mb-3 text-green-600">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-lg font-bold">${plan.price}</p>
            <ul className="text-sm mt-2">
              {plan.features?.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => purchasePlan(plan.id)}
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDetails;
