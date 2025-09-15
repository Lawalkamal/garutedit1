// src/components/admin/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from './ImageUpload';
import { productService, Product, ProductFormData } from '@/services/productServices';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

const categories = [
  'Engine Parts',
  'Brake System',
  'Suspension',
  'Electrical',
  'Exhaust System',
  'Transmission',
  'Cooling System',
  'Interior',
  'Exterior',
  'Tools & Equipment'
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    price: 0,
    originalPrice: undefined,
    description: '',
    image: '',
    imagePublicId: '',
    category: categories[0],
    stockCount: 0,
    specifications: {},
    features: ['']
  });
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        description: product.description,
        image: product.image,
        imagePublicId: product.imagePublicId,
        category: product.category,
        stockCount: product.stockCount,
        specifications: product.specifications,
        features: product.features
      });

      // Convert specifications object to array for form
      const specsArray = Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value
      }));
      setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploaded = (imageUrl: string, publicId: string) => {
    handleInputChange('image', imageUrl);
    handleInputChange('imagePublicId', publicId);
  };

  const handleImageRemoved = () => {
    handleInputChange('image', '');
    handleInputChange('imagePublicId', '');
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications(prev =>
      prev.map((spec, i) => i === index ? { ...spec, [field]: value } : spec)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert specifications array back to object
      const specsObject = specifications.reduce((obj, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          obj[spec.key.trim()] = spec.value.trim();
        }
        return obj;
      }, {} as Record<string, string>);

      // Filter out empty features
      const cleanFeatures = formData.features.filter(f => f.trim().length > 0);

      const productData: ProductFormData = {
        ...formData,
        features: cleanFeatures,
        specifications: specsObject
      };

      if (product?.id) {
        await productService.updateProduct(product.id, productData);
      } else {
        await productService.addProduct(productData);
      }

      onSave();
    } catch (error: any) {
      setError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onCancel} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockCount}
                  onChange={(e) => handleInputChange('stockCount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                currentImage={formData.image}
              />
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
              placeholder="Detailed product description..."
              required
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Features
              <Button type="button" onClick={addFeature} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Specifications
              <Button type="button" onClick={addSpecification} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-center">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Property name"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Value"
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !formData.image} className="btn-racing">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;