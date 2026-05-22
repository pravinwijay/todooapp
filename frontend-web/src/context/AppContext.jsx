import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, todoService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todosLoading, setTodosLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Charger l'état utilisateur initial au démarrage de l'app
  useEffect(() => {
    const initAuth = () => {
      const savedUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      if (authenticated && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Déclencher la récupération des Todos dès que l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  // Déclencher une notification temporaire
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Actions Authentification
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      showNotification('Ravi de vous revoir ! Connexion réussie.', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Identifiants incorrects ou serveur indisponible.';
      showNotification(errMsg, 'danger');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email, password, name) => {
    try {
      setLoading(true);
      const data = await authService.signup(email, password, name);
      setUser(data.user);
      setIsAuthenticated(true);
      showNotification('Compte créé avec succès ! Bienvenue.', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Erreur lors de la création du compte.';
      showNotification(errMsg, 'danger');
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    showNotification('Vous avez été déconnecté.', 'info');
  };

  // Actions CRUD Todos
  const fetchTodos = async () => {
    setTodosLoading(true);
    try {
      const response = await todoService.getAll();
      if (response.success) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error('Erreur de chargement des tâches :', error);
      showNotification('Impossible de charger les tâches.', 'danger');
    } finally {
      setTodosLoading(false);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await todoService.create(title);
      if (response.success) {
        setTodos((prev) => [response.data, ...prev]);
        showNotification('Nouvelle tâche ajoutée !', 'success');
        return true;
      }
    } catch (error) {
      showNotification('Erreur lors de l\'ajout de la tâche.', 'danger');
      return false;
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      const response = await todoService.update(id, undefined, !currentStatus);
      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? response.data : todo))
        );
        showNotification(
          response.data.completed
            ? 'Tâche marquée comme complétée !'
            : 'Tâche réouverte.',
          'success'
        );
      }
    } catch (error) {
      showNotification('Erreur de modification du statut.', 'danger');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await todoService.delete(id);
      if (response.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        showNotification('Tâche supprimée.', 'warning');
      }
    } catch (error) {
      showNotification('Erreur lors de la suppression.', 'danger');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        todos,
        loading,
        todosLoading,
        notification,
        showNotification,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        addTodo,
        toggleTodo,
        deleteTodo,
        refreshTodos: fetchTodos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
