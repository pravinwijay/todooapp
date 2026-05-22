import prisma from '../config/db.js';

/**
 * Récupérer toutes les tâches de l'utilisateur connecté
 */
export const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches.',
    });
  }
};

/**
 * Récupérer une tâche spécifique par son ID
 */
export const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable.',
      });
    }

    // Sécurité : s'assurer que la tâche appartient bien à l'utilisateur connecté
    if (todo.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette tâche.',
      });
    }

    return res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la tâche.',
    });
  }
};

/**
 * Créer une nouvelle tâche
 */
export const createTodo = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Le titre de la tâche est obligatoire.',
    });
  }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès !',
      data: newTodo,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la tâche.',
    });
  }
};

/**
 * Mettre à jour une tâche (titre et/ou complétion)
 */
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    // Vérifier l'existence et la propriété de la tâche
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable.',
      });
    }

    if (todo.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette tâche.',
      });
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (title !== undefined && title.trim() !== '') {
      updateData.title = title.trim();
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Tâche mise à jour avec succès !',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la tâche.',
    });
  }
};

/**
 * Supprimer une tâche
 */
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier l'existence et la propriété de la tâche
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Tâche introuvable.',
      });
    }

    if (todo.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette tâche.',
      });
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Tâche supprimée avec succès !',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la tâche.',
    });
  }
};
