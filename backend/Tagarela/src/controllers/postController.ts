import { Request, Response } from "express";
import {
  createPost,
  getAllPosts
} from "../services/postService";


/**
 * @controller createPostController
 * @desc Controlador para criação de novos posts
 * @route POST /posts
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {number} req.body.authorId - ID do autor do post (obrigatório)
 * @param {number} req.body.victimId - ID da vítima/alvo do post (obrigatório)
 * @param {string} req.body.gossip - Conteúdo do post/fofoca (obrigatório)
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @returns {Response} 
 * - 201 Created: Retorna o novo post criado em formato JSON
 * - 400 Bad Request: 
 *   - Se campos obrigatórios estiverem faltando
 *   - Se ocorrer erro na criação do post
 * 
 * @example
 * // Request body example
 * {
 *   "authorId": 123,
 *   "victimId": 456,
 *   "gossip": "Fulano estava vendo o jogo durante o horário de trabalho"
 * }
 */

export function createPostController(req: Request, res: Response): void {
    const { authorId, victimId, gossip } = req.body;
  
    if (!authorId || !victimId || !gossip ) {
      res.status(400).json({ error: "Missing fields in request body" });
      return
    }
  
    try {
      const newPost = createPost(authorId, victimId, gossip);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
}

/**
 * @controller getAllPostsController
 * @desc Controlador para listagem de todos os posts
 * @route GET /posts
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express
 * @param {Response} res - Objeto de resposta do Express
 * 
 * @returns {Response} 
 * - 200 OK: Retorna array com todos os posts em formato JSON
 * 
 * @example
 * // Response example
 * [
 *   {
 *     "id": 1,
 *     "authorId": 123,
 *     "victimId": 456,
 *     "gossip": "Fulano estava...",
 *     "createdAt": "2023-01-01T00:00:00.000Z"
 *   },
 *   ...
 * ]
 */
export function getAllPostsController(req: Request, res: Response): void {
  const list = getAllPosts();
  res.status(200).json(list);
}
