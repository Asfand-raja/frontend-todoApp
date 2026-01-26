import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllToDo } from '../utils/HandleApi';

const ToDoContext = createContext();

export const ToDoProvider = ({ children }) => {
    const [toDo, setToDo] = useState([]);
    const [loading, setLoading] = useState(false);

    // Helper to refresh todos
    const refreshToDos = useCallback(async () => {
        setLoading(true);
        try {
            await getAllToDo(setToDo);
        } catch (error) {
            console.error("Failed to refresh todos", error);
            // Toast is already handled in getAllToDo via HandleApi
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ToDoContext.Provider value={{ toDo, setToDo, refreshToDos, loading }}>
            {children}
        </ToDoContext.Provider>
    );
};

export const useToDo = () => {
    const context = useContext(ToDoContext);
    if (!context) {
        throw new Error('useToDo must be used within a ToDoProvider');
    }
    return context;
};
