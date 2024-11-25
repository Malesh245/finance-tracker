"use client";
import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import AddExpensesModal from "@/components/modals/AddExpensesModal";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import SignIn from "@/components/SignIn";
import { authContext } from "@/lib/store/auth-context";
import { financeContext } from "@/lib/store/finance-context";
import { currencyFormatter } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [showAddIcomModal, setShowAddIcomModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const { expenses, income } = useContext(financeContext);

  const { user } = useContext(authContext);

  useEffect(() => {
    const newBalance =
      income.reduce((total, i) => {
        return total + i.amount;
      }, 0) -
      expenses.reduce((total, e) => {
        return total + e.total;
      }, 0);

    setBalance(newBalance);
  }, [expenses, income]);

  if (!user) {
    return <SignIn />;
  }

  return (
    <>
      {/* Add Icome Modal */}
      <AddIncomeModal show={showAddIcomModal} onClose={setShowAddIcomModal} />
      {/* Add Expenses Modal */}
      <AddExpensesModal
        show={showAddExpenseModal}
        onClose={setShowAddExpenseModal}
      />

      <main className="container max-w-2xl p-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-sm">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>
        <section className="flex items-center gap-2 py-3">
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="btn btn-primary"
          >
            + Expense
          </button>
          <button
            onClick={() => setShowAddIcomModal(true)}
            className="btn btn-primary-outline"
          >
            + Income
          </button>
        </section>
        {/* Expense */}
        <section className="py-6">
          <h3 className="text-2xl ">My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCategoryItem expense={expense} key={expense.id} />
            ))}
          </div>
        </section>
        {/* Chart Section */}
        <section className="py-6">
          <h3 className="text-2xl ">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),

                    borderColor: ["#18181b"],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
