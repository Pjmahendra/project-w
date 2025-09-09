import { executeQuery, executeTransaction } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Birthday Service - Handles all birthday-related database operations

export const birthdayService = {
  // Get all approved birthday messages
  async getAllMessages() {
    const query = `
      SELECT 
        id, message, author, created_at, likes,
        CHAR_LENGTH(message) as message_length
      FROM birthday_messages 
      WHERE is_approved = TRUE 
      ORDER BY created_at DESC
    `;
    return await executeQuery(query);
  },

  // Get all messages (including pending approval)
  async getAllMessagesAdmin() {
    const query = `
      SELECT 
        id, message, author, created_at, likes, is_approved,
        ip_address, user_agent, CHAR_LENGTH(message) as message_length
      FROM birthday_messages 
      ORDER BY created_at DESC
    `;
    return await executeQuery(query);
  },

  // Get message by ID
  async getMessageById(id) {
    const query = 'SELECT * FROM birthday_messages WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Add new birthday message
  async addMessage(messageData) {
    const {
      message,
      author = 'Anonymous',
      ip_address = null,
      user_agent = null
    } = messageData;

    const id = uuidv4();
    const query = `
      INSERT INTO birthday_messages 
      (id, message, author, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [id, message, author, ip_address, user_agent];
    return await executeQuery(query, params);
  },

  // Update message
  async updateMessage(id, updateData) {
    const { message, author, is_approved } = updateData;
    
    const fields = [];
    const params = [];

    if (message !== undefined) {
      fields.push('message = ?');
      params.push(message);
    }
    if (author !== undefined) {
      fields.push('author = ?');
      params.push(author);
    }
    if (is_approved !== undefined) {
      fields.push('is_approved = ?');
      params.push(is_approved);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE birthday_messages SET ${fields.join(', ')} WHERE id = ?`;
    return await executeQuery(query, params);
  },

  // Delete message
  async deleteMessage(id) {
    const query = 'DELETE FROM birthday_messages WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Like a message
  async likeMessage(id) {
    const query = 'UPDATE birthday_messages SET likes = likes + 1 WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Get random birthday message
  async getRandomMessage() {
    const query = `
      SELECT 
        id, message, author, created_at, likes
      FROM birthday_messages 
      WHERE is_approved = TRUE
      ORDER BY RAND() 
      LIMIT 1
    `;
    return await executeQuery(query);
  },

  // Search messages by keyword
  async searchMessages(keyword) {
    const query = `
      SELECT 
        id, message, author, created_at, likes
      FROM birthday_messages 
      WHERE is_approved = TRUE 
      AND MATCH(message) AGAINST(? IN NATURAL LANGUAGE MODE)
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [keyword]);
  },

  // Get messages by author
  async getMessagesByAuthor(author) {
    const query = `
      SELECT 
        id, message, author, created_at, likes
      FROM birthday_messages 
      WHERE is_approved = TRUE 
      AND author = ?
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [author]);
  },

  // Get all approved birthday wishes
  async getAllWishes() {
    const query = `
      SELECT 
        id, name, wish, email, created_at,
        CHAR_LENGTH(wish) as wish_length
      FROM birthday_wishes 
      WHERE is_approved = TRUE 
      ORDER BY created_at DESC
    `;
    return await executeQuery(query);
  },

  // Get all wishes (including pending approval)
  async getAllWishesAdmin() {
    const query = `
      SELECT 
        id, name, wish, email, created_at, is_approved,
        ip_address, user_agent, CHAR_LENGTH(wish) as wish_length
      FROM birthday_wishes 
      ORDER BY created_at DESC
    `;
    return await executeQuery(query);
  },

  // Get wish by ID
  async getWishById(id) {
    const query = 'SELECT * FROM birthday_wishes WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Add new birthday wish
  async addWish(wishData) {
    const {
      name,
      wish,
      email = null,
      ip_address = null,
      user_agent = null
    } = wishData;

    const id = uuidv4();
    const query = `
      INSERT INTO birthday_wishes 
      (id, name, wish, email, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [id, name, wish, email, ip_address, user_agent];
    return await executeQuery(query, params);
  },

  // Update wish
  async updateWish(id, updateData) {
    const { name, wish, email, is_approved } = updateData;
    
    const fields = [];
    const params = [];

    if (name !== undefined) {
      fields.push('name = ?');
      params.push(name);
    }
    if (wish !== undefined) {
      fields.push('wish = ?');
      params.push(wish);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      params.push(email);
    }
    if (is_approved !== undefined) {
      fields.push('is_approved = ?');
      params.push(is_approved);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE birthday_wishes SET ${fields.join(', ')} WHERE id = ?`;
    return await executeQuery(query, params);
  },

  // Delete wish
  async deleteWish(id) {
    const query = 'DELETE FROM birthday_wishes WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Search wishes by keyword
  async searchWishes(keyword) {
    const query = `
      SELECT 
        id, name, wish, email, created_at
      FROM birthday_wishes 
      WHERE is_approved = TRUE 
      AND MATCH(wish) AGAINST(? IN NATURAL LANGUAGE MODE)
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [keyword]);
  },

  // Get wishes by name
  async getWishesByName(name) {
    const query = `
      SELECT 
        id, name, wish, email, created_at
      FROM birthday_wishes 
      WHERE is_approved = TRUE 
      AND name = ?
      ORDER BY created_at DESC
    `;
    return await executeQuery(query, [name]);
  },

  // Get pending approval items
  async getPendingItems() {
    const query = `
      SELECT 
        'message' as type,
        id,
        message as content,
        author,
        created_at
      FROM birthday_messages 
      WHERE is_approved = FALSE
      UNION ALL
      SELECT 
        'wish' as type,
        id,
        wish as content,
        name as author,
        created_at
      FROM birthday_wishes 
      WHERE is_approved = FALSE
      ORDER BY created_at DESC
    `;
    return await executeQuery(query);
  },

  // Get birthday statistics
  async getBirthdayStats() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE) as total_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE) as total_wishes,
        (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = FALSE) as pending_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = FALSE) as pending_wishes,
        (SELECT AVG(likes) FROM birthday_messages WHERE is_approved = TRUE) as avg_likes,
        (SELECT COUNT(*) FROM birthday_messages WHERE DATE(created_at) = CURDATE()) as today_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE DATE(created_at) = CURDATE()) as today_wishes
    `;
    return await executeQuery(query);
  }
};
