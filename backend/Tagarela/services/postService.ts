import { Post } from "../models/post";
import { getUserById } from "./userService";

let posts: Post[] = [
    { id: 1, authorId:1, victimId:2, gossip: "Diz que é Flamenguista, mas acha que o Zico ainda é titular" },
    { id: 2, authorId:2, victimId:1, gossip: "Diz que é Botafoguense, mas não existem botafoguenses" },
    { id: 3, authorId:3, victimId:1, gossip: "Diz que é Tricolor, mas não existem tricolores com menos de 60 anos" },
];

/**
 * @service createPost
 * @desc Cria um novo post após validar todas as regras de negócio
 * 
 * @param {number} authorId - ID do autor do post (deve existir)
 * @param {number} victimId - ID do usuário alvo do post (deve existir e ser diferente do autor)
 * @param {string} gossip - O conteúdo do post (não pode ser vazio)
 * 
 * @throws {Error} Lança erro quando:
 * - Autor não existe
 * - Alvo não existe
 * - Autor e alvo são o mesmo usuário
 * - Conteúdo do post está vazio
 * 
 * @returns {Post} O novo post criado
 * 
 * @example
 * const post = createPost(1, 2, "Novo conteúdo de fofoca");
 */

export function createPost(
    authorId: number,
    victimId: number,
    gossip: string
  ): Post {

     // Verifica se autor existe
    const author = getUserById(authorId);
    if (!author) {
        throw new Error("Author does not exist");
    }

     // Verifica se alvo existe
    const victim = getUserById(victimId);
    if (!victim) {
        throw new Error("Victim does not exist");
    }

    // Validação de regra de negócio
    if (authorId === victimId) {
        throw new Error("Author and victim cannot be the same");
    }

     // Gera novo ID de forma segura (trata caso de array vazio)
    const newId = Math.max(...posts.map(p => p.id), 0) + 1;
    const newPost: Post = { id: newId, victimId, authorId, gossip };
    posts.push(newPost);
    return newPost;
}

/**
 * @service getAllPosts
 * @desc Recupera todos os posts do banco de dados
 * 
 * @returns {Post[]} Array com todos os posts
 * 
 * @example
 * const todosPosts = getAllPosts();
 */
export function getAllPosts(): Post[] {
  return posts;
}


/**
 * Verifica se um usuário está envolvido em algum post (como autor ou vítima)
 * 
 * @param userId - ID do usuário
 * @returns true se houver qualquer post relacionado a ele
 */
export function hasPosts(userId: number): boolean {
    return posts.some(post => post.authorId === userId || post.victimId === userId);
}
  
/**
 * Retorna todos os posts onde o usuário foi vítima.
 * 
 * @param userId - ID do usuário alvo
 * @returns Array de posts em que o usuário é a vítima
 */
export function getPostsByVictim(userId: number): Post[] {
    return posts.filter(post => post.victimId === userId);
}
  
/**
 * Retorna os 5 usuários com maior número de posts como autores.
 * 
 * @returns Array de objetos contendo authorId e quantidade de posts
 */
export function getTop5Authors(): { authorId: number; count: number }[] {
    const authorCount: { [authorId: number]: number } = {};

    for (const post of posts) {
        authorCount[post.authorId] = (authorCount[post.authorId] || 0) + 1;
    }

    return Object.entries(authorCount)
        .map(([authorId, count]) => ({ authorId: parseInt(authorId), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}
