"use client";
import { createContext, useState, useEffect, useContext } from "react";
// Firebase connection
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { authContext } from "./auth-context";

export const financeContext = createContext({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const { user } = useContext(authContext);

  // Add Category

  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });

      setExpenses((prev) => {
        return [
          ...prev,
          {
            id: docSnap.id,
            uid: user.uid,
            items: [],
            ...category,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };

  const addExpenseItem = async (expenseCategoryId, newExpense) => {
    const docRef = doc(db, "expenses", expenseCategoryId);
    try {
      await updateDoc(docRef, { ...newExpense });

      // update state
      setExpenses((prev) => {
        const updatedExpenses = [...prev];

        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });
        updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };

        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, { ...updatedExpense });

      setExpenses((prev) => {
        const updatedExpenses = [...prev];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId
        );
        updatedExpenses[pos].item = [...updatedExpense.items];
        updatedExpenses[pos].item = updatedExpense.total;
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prev) => {
        const updatedExpenses = prev.filter(
          (expense) => expense.id !== expenseCategoryId
        );

        return [...updatedExpenses];
      });
    } catch (error) {
      throw error;
    }
  };

  const addIncomeItem = async (newIcome) => {
    const collectionRef = collection(db, "income");

    try {
      const docSnap = await addDoc(collectionRef, newIcome);
      // update state
      setIncome((prev) => {
        return [
          ...prev,
          {
            id: docSnap.id,
            ...newIcome,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };
  const removeIncomeItem = async (incomeId) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      // update state
      setIncome((prev) => {
        return prev.filter((i) => i.id !== incomeId);
      });
    } catch (error) {
      throw error;
    }
  };

  const values = {
    income,
    expenses,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };
  // Fetch Income

  useEffect(() => {
    if (!user) return;
    const getIncomeData = async () => {
      try {
        const collectionRef = collection(db, "income");

        const q = query(collectionRef, where("uid", "==", user.uid));

        const docsSnap = await getDocs(q);

        const data = docsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt
            ? new Date(doc.data().createdAt.toMillis())
            : null,
        }));

        setIncome(data);
      } catch (error) {
        throw error;
      }
    };
    const getExpensesData = async () => {
      try {
        const collectionRef = collection(db, "expenses");
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);

        const data = docsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExpenses(data);
      } catch (error) {
        throw error;
      }
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

  return (
    <financeContext.Provider value={values}>{children}</financeContext.Provider>
  );
}
