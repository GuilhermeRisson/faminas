import { Request, Response } from "express";
import { createUser, getAllUsers, getUserById,deleteUser, getPostsWhereUserIsVictim, getTopAuthors  } from "../services/userService";

/**
 * @controller createUserController
 * @desc Cria um novo usuário após validar os dados de entrada
 * @route POST /users
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {string} req.body.name - Nome do usuário (deve ter pelo menos 2 caracteres)
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @throws {Error} Se o nome for inválido
 * 
 * @returns {Response}
 * - 201 Created: Retorna o usuário criado
 * - 400 Bad Request: Se o nome for inválido ou não fornecido
 * 
 * @example POST /users
 * Request body: { "name": "Ana" }
 * Response: 201 { "id": 1, "name": "Ana", "createdAt": "2023-01-01T00:00:00.000Z" }
 */

export function createUserController(req: Request, res: Response): void {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const user = createUser(name);
  res.status(201).json(user);
}

/**
 * @controller getAllUsersController
 * @desc Retorna todos os usuários cadastrados (com paginação implícita)
 * @route GET /users
 * @access Public
 * 
 * @returns {Response}
 * - 200 OK: Array de usuários
 * 
 * @example GET /users
 * Response: 200 [{ "id": 1, "name": "Ana", ... }]
 */

export function getAllUsersController(req: Request, res: Response): void {
  const list = getAllUsers();
  res.status(200).json(list);
}

/**
 * @controller getUserByIdController
 * @desc Obtém um usuário pelo ID com validação de parâmetro
 * @route GET /users/:id
 * @access Public
 * 
 * @param {number} req.params.id - Deve ser um número inteiro positivo
 * 
 * @returns {Response}
 * - 200 OK: Usuário encontrado
 * - 400 Bad Request: ID inválido
 * - 404 Not Found: Usuário não encontrado
 * 
 * @example GET /users/123
 * Response: 200 { "id": 123, "name": "Ana" }
 */

export function getUserByIdController(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid ID: must be a positive integer" });
    return;
  }
  
  const user = getUserById(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
}


/**
 * @controller deleteUserController
 * @desc Exclui um usuário se ele não estiver envolvido em nenhum post (como autor ou vítima)
 * @route DELETE /users/:id
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {number} req.params.id - ID do usuário a ser excluído (deve ser um número inteiro positivo)
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @returns {Response}
 * - 200 OK: Usuário excluído com sucesso
 * - 400 Bad Request: ID inválido ou usuário envolvido em posts
 * - 404 Not Found: Usuário não encontrado
 */
export function deleteUserController(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid ID: must be a positive integer" });
    return;
  }

  const success = deleteUser(id);
  if (!success) {
    const user = getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: "User has related posts and cannot be deleted" });
    }
    return;
  }

  res.status(200).json({ message: "User deleted successfully" });
}

/**
 * @controller getPostsWhereUserIsVictimController
 * @desc Retorna todos os posts em que o usuário foi vítima
 * @route GET /users/:id/victim-posts
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {number} req.params.id - ID do usuário para buscar os posts onde é vítima
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @returns {Response}
 * - 200 OK: Array com os posts onde o usuário é vítima
 * - 400 Bad Request: ID inválido
 */
export function getPostsWhereUserIsVictimController(req: Request, res: Response): void {
  const userId = parseInt(req.params.id);

  if (isNaN(userId) || userId <= 0) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const posts = getPostsWhereUserIsVictim(userId);
  res.status(200).json(posts);
}

/**
 * @controller getTopAuthorsController
 * @desc Retorna os 5 usuários com maior número de autorias de posts
 * @route GET /users/top-authors
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @returns {Response}
 * - 200 OK: Array com os dados dos 5 principais autores
 * 
 * @example
 * Response: 200 [
 *   { "authorId": 1, "count": 10 },
 *   { "authorId": 2, "count": 8 },
 *   ...
 * ]
 */
export function getTopAuthorsController(req: Request, res: Response): void {
  const topAuthors = getTopAuthors();
  res.status(200).json(topAuthors);
}