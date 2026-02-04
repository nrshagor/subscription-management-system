import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
type Subscription = {
  id: number;
  status: string;
  plan: {
    id: number;
    name: string;
    price: number;
    vendor: {
      name: string;
    };
  };
};
const Dashboard = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch("/my-subscriptions").then(setSubs);
  }, []);

  const upgradePlan = async (subId: number, newPlanId: number) => {
    try {
      await apiFetch("/upgrade", {
        method: "POST",
        body: JSON.stringify({
          subscription_id: subId,
          new_plan_id: newPlanId,
        }),
      });
      setMessage("Subscription upgraded!");
      const updated = await apiFetch("/my-subscriptions");
      setSubs(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
      {message && <p className="text-green-600">{message}</p>}

      <div className="space-y-4">
        {subs.map((s) => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h2 className="font-bold">
              {s.plan.vendor.name} - {s.plan.name}
            </h2>
            <p>Status: {s.status}</p>

            <button
              onClick={() => upgradePlan(s.id, s.plan.id + 1)}
              className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
