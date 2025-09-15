// src/services/productService.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  imagePublicId?: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  imagePublicId?: string;
  category: string;
  stockCount: number;
  specifications: Record<string, string>;
  features: string[];
}

const COLLECTION_NAME = 'products';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get single product
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Add new product
  async addProduct(productData: ProductFormData): Promise<string> {
    try {
      const product: Omit<Product, 'id'> = {
        ...productData,
        inStock: productData.stockCount > 0,
        rating: 5.0, // Default rating
        reviews: 0, // Default review count
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...product,
        createdAt: Timestamp.fromDate(product.createdAt),
        updatedAt: Timestamp.fromDate(product.updatedAt),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      const updateData = {
        ...productData,
        inStock: productData.stockCount ? productData.stockCount > 0 : undefined,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Soft delete product (mark as inactive)
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that searches in name and description
      // For better search, consider using Algolia or implement client-side filtering
      
      const allProducts = await this.getAllProducts();
      const searchLower = searchTerm.toLowerCase();
      
      return allProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get product categories
  async getCategories(): Promise <string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products.map(p => p.category))];
     categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Update stock count
  async updateStock(id: string, newStockCount: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        stockCount: newStockCount,
        inStock: newStockCount > 0,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};