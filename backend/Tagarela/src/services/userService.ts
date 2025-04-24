import { User } from "../models/user";
import { Post } from "../models/post";
import { hasPosts,getPostsByVictim, getTop5Authors } from "./postService"; 
/**
 * Array in-memory que armazena os usuários.
 * Inicializado com três usuários de exemplo.
 */

let users: User[] = [
  { id: 1, name: "Nelsinho" },
  { id: 2, name: "Soninha" },
  { id: 3, name: "Leozin" },
];

/**
 * Cria um novo usuário e adiciona à lista de usuários
 * @param name - Nome do usuário a ser criado
 * @returns O usuário recém-criado
 * @throws Pode lançar erro se o nome for vazio ou apenas espaços
 */

export function createUser(name: string): User {

  // Calcula o novo ID como o maior ID existente + 1
  const newId = Math.max(...users.map(user => user.id), 0) + 1;
  const newUser: User = { id: newId, name };
  users.push(newUser);
  return newUser;
}

/**
 * Retorna todos os usuários cadastrados
 * @returns Array com todos os usuários
 */

export function getAllUsers(): User[] {
  // Retornamos uma cópia para evitar modificações acidentais no array original
  return [...users];
}

/**
 * Busca um usuário pelo ID
 * @param id - ID do usuário a ser encontrado
 * @returns O usuário encontrado ou undefined se não existir
 */
export function getUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}


/**
 * Exclui um usuário da lista caso ele não esteja envolvido em posts.
 * 
 * @param id - ID do usuário a ser excluído
 * @returns true se o usuário foi excluído, false se não foi
 */
export function deleteUser(id: number): boolean {
  if (hasPosts(id)) return false;

  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}

/**
 * Retorna todos os posts onde o usuário foi vítima.
 * 
 * @param userId - ID do usuário alvo
 * @returns Array de posts em que o usuário é a vítima
 */
export function getPostsWhereUserIsVictim(userId: number): Post[] {
  return getPostsByVictim(userId); // Agora isso está no postService, mas é chamado no userService
}

/**
 * Retorna os 5 usuários com maior número de posts como autores.
 * 
 * @returns Array de objetos contendo authorId e quantidade de posts
 */
export function getTopAuthors(): { authorId: number; count: number }[] {
  return getTop5Authors(); // Também movido para o postService
}