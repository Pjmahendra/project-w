import { executeQuery, executeSingle, getSingle } from '../config/sqlite-database.js';
import { v4 as uuidv4 } from 'uuid';

// Gallery Service for SQLite - Handles all gallery-related database operations

export const galleryService = {
  // Get all active gallery images
  async getAllImages() {
    const query = `
      SELECT 
        id, src, alt, metadata, created_at, updated_at,
        display_order, file_size, mime_type, width, height,
        CASE 
          WHEN width > 0 AND height > 0 THEN ROUND(CAST(width AS REAL) / height, 2)
          ELSE NULL 
        END as aspect_ratio
      FROM gallery_images 
      WHERE is_active = 1 
      ORDER BY display_order, created_at
    `;
    return await executeQuery(query);
  },

  // Get image by ID
  async getImageById(id) {
    const query = 'SELECT * FROM gallery_images WHERE id = ? AND is_active = 1';
    return await getSingle(query, [id]);
  },

  // Add new image
  async addImage(imageData) {
    const {
      src,
      alt = '',
      metadata = {},
      display_order = 0,
      file_size = null,
      mime_type = null,
      width = null,
      height = null
    } = imageData;

    const id = uuidv4();
    const query = `
      INSERT INTO gallery_images 
      (id, src, alt, metadata, display_order, file_size, mime_type, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [id, src, alt, JSON.stringify(metadata), display_order, file_size, mime_type, width, height];
    return await executeSingle(query, params);
  },

  // Update image
  async updateImage(id, updateData) {
    const {
      src,
      alt,
      metadata,
      display_order,
      file_size,
      mime_type,
      width,
      height
    } = updateData;

    // Build dynamic query based on provided fields
    const fields = [];
    const params = [];

    if (src !== undefined) {
      fields.push('src = ?');
      params.push(src);
    }
    if (alt !== undefined) {
      fields.push('alt = ?');
      params.push(alt);
    }
    if (metadata !== undefined) {
      fields.push('metadata = ?');
      params.push(JSON.stringify(metadata));
    }
    if (display_order !== undefined) {
      fields.push('display_order = ?');
      params.push(display_order);
    }
    if (file_size !== undefined) {
      fields.push('file_size = ?');
      params.push(file_size);
    }
    if (mime_type !== undefined) {
      fields.push('mime_type = ?');
      params.push(mime_type);
    }
    if (width !== undefined) {
      fields.push('width = ?');
      params.push(width);
    }
    if (height !== undefined) {
      fields.push('height = ?');
      params.push(height);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE gallery_images SET ${fields.join(', ')} WHERE id = ?`;
    return await executeSingle(query, params);
  },

  // Delete image (soft delete)
  async deleteImage(id) {
    const query = 'UPDATE gallery_images SET is_active = 0 WHERE id = ?';
    return await executeSingle(query, [id]);
  },

  // Permanently delete image
  async permanentDeleteImage(id) {
    const query = 'DELETE FROM gallery_images WHERE id = ?';
    return await executeSingle(query, [id]);
  },

  // Get images by category
  async getImagesByCategory(category) {
    const query = `
      SELECT * FROM gallery_images 
      WHERE is_active = 1 
      AND json_extract(metadata, '$.category') = ?
      ORDER BY display_order, created_at
    `;
    return await executeQuery(query, [category]);
  },

  // Get image statistics
  async getImageStats() {
    const query = `
      SELECT 
        COUNT(*) as total_images,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_images,
        AVG(file_size) as avg_file_size,
        SUM(file_size) as total_size,
        COUNT(CASE WHEN mime_type LIKE 'image/jpeg' THEN 1 END) as jpeg_count,
        COUNT(CASE WHEN mime_type LIKE 'image/png' THEN 1 END) as png_count,
        COUNT(CASE WHEN mime_type LIKE 'image/gif' THEN 1 END) as gif_count
      FROM gallery_images
    `;
    return await getSingle(query);
  }
};
