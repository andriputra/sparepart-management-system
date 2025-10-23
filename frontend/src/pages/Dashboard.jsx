import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      <p className="text-gray-700">You are logged in successfully!</p>
    </DashboardLayout>
  );
}