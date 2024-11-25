import { currencyFormatter } from "@/lib/utils";
import React, { useContext, useEffect, useRef } from "react";
import Modal from "../Modal";
// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";
import toast from "react-hot-toast";

function AddIncomeModal({ show, onClose }) {
  const amountRef = useRef();
  const descriptionRef = useRef();
  const { income, addIncomeItem, removeIncomeItem } =
    useContext(financeContext);

  const { user } = useContext(authContext);

  //Add Icome Handler Function
  const addIncomeHander = async (e) => {
    e.preventDefault();
    const newIcome = {
      amount: +amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: new Date(),
      uid: user.uid,
    };
    try {
      await addIncomeItem(newIcome);
      descriptionRef.current.value = "";
      amountRef.current.value = "";
      toast.success("Income added successfully !");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add income");
    }
  };

  // Delete Income

  const deleteIncomeEntryHandler = async (incomeId) => {
    try {
      await removeIncomeItem(incomeId);
      toast.success("Income item deleted successfully");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete income item");
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <form onSubmit={addIncomeHander} className="input-group">
        <div className="input-group">
          <label htmlFor="amount">Income Amount</label>
          <input
            type="number"
            ref={amountRef}
            name="amount"
            min={0.01}
            step={0.01}
            placeholder="Enter income amount"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            ref={descriptionRef}
            name="description"
            min={0.01}
            step={0.01}
            placeholder="Enter income description"
            required
          />
        </div>
        <button className="btn btn-primary">Add Entry</button>
      </form>
      <div className="flex flex-col gap-4 mt-6 ">
        <h3 className="text-2xl font-bold">Income History</h3>
        {income.map((i) => {
          return (
            <div key={i.id} className="flex justify-between">
              <div>
                <p className="font-semibold">{i.description}</p>
                <small className="text-xs">
                  {i.createdAt
                    ? i.createdAt.toISOString()
                    : "No date available"}
                </small>
              </div>
              <p className="flex items-center gap-2">
                {currencyFormatter(i.amount)}
                <button onClick={() => deleteIncomeEntryHandler(i.id)}>
                  <FaRegTrashAlt />
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default AddIncomeModal;
