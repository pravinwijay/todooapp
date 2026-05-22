import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  User, 
  CheckSquare, 
  Filter, 
  Calendar,
  Layers,
  Search
} from 'lucide-react';

const Dashboard = () => {
  const { 
    user, 
    logout, 
    todos, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    todosLoading 
  } = useApp();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setAdding(true);
    const success = await addTodo(newTodoTitle);
    if (success) {
      setNewTodoTitle('');
    }
    setAdding(false);
  };

  // Filtrer les todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Métriques de progression
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const progressPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div style={styles.container}>
      {/* Navbar Premium */}
      <header style={styles.navbar} className="glass-card">
        <div style={styles.navBrand}>
          <CheckSquare size={24} color="var(--accent-primary)" />
          <span style={styles.brandText}>DevOps TaskManager</span>
        </div>
        
        <div style={styles.navUser}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <User size={16} color="var(--accent-secondary)" />
            </div>
            <span style={styles.username}>{user?.name || user?.email || 'Membre DevOps'}</span>
          </div>
          <button onClick={logout} className="btn btn-secondary" style={styles.logoutBtn}>
            <LogOut size={16} />
            <span style={styles.logoutText}>Déconnexion</span>
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.layoutGrid}>
          
          {/* Section Gauche : Statistiques et Progression */}
          <section style={styles.statsSection} className="glass-card">
            <h2 style={styles.sectionTitle}>Statistiques & Sprint</h2>
            
            <div style={styles.statsCard}>
              <div style={styles.progressHeader}>
                <span style={styles.progressTitle}>Complétion Globale</span>
                <span style={styles.progressValue}>{progressPercent}%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div 
                  style={{
                    ...styles.progressBarFill,
                    width: `${progressPercent}%`
                  }}
                ></div>
              </div>
              <div style={styles.statsRow}>
                <div style={styles.statBox}>
                  <span style={styles.statNumber}>{totalTodos}</span>
                  <span style={styles.statLabel}>Tâches créées</span>
                </div>
                <div style={styles.statBox}>
                  <span style={{ ...styles.statNumber, color: 'var(--color-success)' }}>{completedTodos}</span>
                  <span style={styles.statLabel}>Tâches finies</span>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <Calendar size={18} color="var(--accent-primary)" />
              <div style={styles.infoTextContainer}>
                <span style={styles.infoTitle}>Aujourd'hui</span>
                <span style={styles.infoSubtitle}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <Layers size={18} color="var(--accent-secondary)" />
              <div style={styles.infoTextContainer}>
                <span style={styles.infoTitle}>Environnement</span>
                <span style={styles.infoSubtitle}>Staging Local / Sandbox</span>
              </div>
            </div>
          </section>

          {/* Section Droite : Liste des tâches et Actions */}
          <section style={styles.todoSection}>
            
            {/* Formulaire de création de tâche */}
            <form onSubmit={handleAddTodo} style={styles.addForm} className="glass-card">
              <input
                type="text"
                placeholder="Ajouter un backlog ou une tâche DevOps... (ex: Rédiger le Dockerfile)"
                style={styles.addInput}
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                disabled={adding}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={styles.addBtn}
                disabled={adding || !newTodoTitle.trim()}
              >
                <Plus size={18} />
                <span>Ajouter</span>
              </button>
            </form>

            {/* Filtres & Recherche */}
            <div style={styles.filterBar} className="glass-card">
              <div style={styles.searchContainer}>
                <Search size={16} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={styles.filterBtns}>
                <button
                  type="button"
                  style={{
                    ...styles.filterBtn,
                    ...(filter === 'all' ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setFilter('all')}
                >
                  Toutes
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.filterBtn,
                    ...(filter === 'active' ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setFilter('active')}
                >
                  En cours
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.filterBtn,
                    ...(filter === 'completed' ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setFilter('completed')}
                >
                  Faites
                </button>
              </div>
            </div>

            {/* Liste des Todos */}
            <div style={styles.todoListContainer}>
              {todosLoading ? (
                <div style={styles.loadingState}>
                  <p>Chargement du backlog en cours...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div style={styles.emptyState} className="glass-card">
                  <p style={styles.emptyText}>Aucune tâche trouvée</p>
                  <p style={styles.emptySubtext}>
                    {searchQuery 
                      ? "Essayez de modifier votre recherche." 
                      : "Détendez-vous ou commencez par en ajouter une !"}
                  </p>
                </div>
              ) : (
                <div style={styles.todoList}>
                  {filteredTodos.map((todo) => (
                    <div 
                      key={todo.id} 
                      style={{
                        ...styles.todoItem,
                        ...(todo.completed ? styles.todoItemCompleted : {})
                      }}
                      className="glass-card"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        style={styles.checkBtn}
                      >
                        {todo.completed ? (
                          <CheckCircle size={20} color="var(--color-success)" />
                        ) : (
                          <Circle size={20} color="var(--text-muted)" />
                        )}
                      </button>

                      <span 
                        style={{
                          ...styles.todoTitle,
                          ...(todo.completed ? styles.todoTitleCompleted : {})
                        }}
                      >
                        {todo.title}
                      </span>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={styles.deleteBtn}
                        title="Supprimer la tâche"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    zIndex: 1,
    position: 'relative',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    width: '100%',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  brandText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.25rem',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #ffffff 40%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
  },
  logoutText: {
    // Media query-like control via React styling is hard, but we keep it simple
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
  },
  statsSection: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: 'fit-content',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  statsCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1.25rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  progressTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  progressValue: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--accent-secondary)',
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--border-radius-full)',
    overflow: 'hidden',
    marginBottom: '1.2rem',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
    borderRadius: 'var(--border-radius-full)',
    transition: 'width 0.4s ease-out',
  },
  statsRow: {
    display: 'flex',
    gap: '1rem',
  },
  statBox: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.75rem',
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
  },
  infoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoSubtitle: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  todoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  addForm: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.8rem 1.2rem',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'var(--transition-fast)',
  },
  addBtn: {
    flexShrink: 0,
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    gap: '1rem',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.5rem 0.5rem 0.5rem 2.2rem',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  filterBtns: {
    display: 'flex',
    gap: '0.4rem',
    background: 'rgba(0, 0, 0, 0.15)',
    padding: '0.25rem',
    borderRadius: 'var(--border-radius-md)',
  },
  filterBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition-fast)',
  },
  filterBtnActive: {
    background: 'var(--bg-tertiary)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  todoListContainer: {
    flex: 1,
  },
  loadingState: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-secondary)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.25rem',
  },
  emptySubtext: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    transition: 'all 0.3s ease',
  },
  todoItemCompleted: {
    background: 'rgba(16, 185, 129, 0.03)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  todoTitle: {
    flex: 1,
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  todoTitleCompleted: {
    textDecoration: 'line-through',
    color: 'var(--text-muted)',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '0.4rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-fast)',
  },
};

// Custom responsive grid handled by global CSS classes would be cleaner,
// but for maximum robustness, we ensure styles are clear.
// Add a simple hover rule via class logic in general elements if needed.

export default Dashboard;
