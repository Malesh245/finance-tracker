import React, { useContext } from "react";
import Modal from "../Modal";
import { currencyFormatter } from "@/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { financeContext } from "@/lib/store/finance-context";
import toast from "react-hot-toast";

function ViewExpenseModal({ show, onclose, expense }) {
  const { deleteExpenseItem, deleteExpenseCategory } =
    useContext(financeContext);

  const deleteExpenseItemhandler = async (item) => {
    try {
      // remove the item from the list

      const updatedItems = expense.items.filter((i) => i.id !== item.id);

      // update the expense balance
      const updatedExpense = {
        items: [...updatedItems],
        total: expense.total - item.amount,
      };
      await deleteExpenseItem(updatedExpense, expense.id);
      expense.items = updatedItems;
      toast.success("Delete expense item successfully !");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete expense item");
    }
  };

  const deleteExpenseCategoryHandler = async () => {
    try {
      await deleteExpenseCategory(expense.id);
      toast.success("Delete caterory successfully !");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Modal show={show} onClose={onclose}>
      <div className="flex items-center justify-between ">
        <h2 className="text-4xl capitalize">{expense.title}</h2>
        <button
          onClick={deleteExpenseCategoryHandler}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
      <div>
        <h3 className="my-4 text-2xl">Expense History</h3>
        {(expense.items || []).map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <small>
              {item.createdAt.toMillis
                ? new Date(item.createdAt.toMillis()).toISOString()
                : item.createdAt.toISOString()}
            </small>
            <p className="flex items-center gap-2">
              {currencyFormatter(item.amount)}
              <button onClick={() => deleteExpenseItemhandler(item)}>
                <FaRegTrashAlt />
              </button>
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ViewExpenseModal;
