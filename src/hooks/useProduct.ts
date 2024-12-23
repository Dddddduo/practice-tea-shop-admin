import { useEffect, useState } from 'react';
// import { fetchProductList, fetchProductDetails } from '../services/productService';
//
export const useProduct = (initData) => {
  const [totalCount, setTotalCount] = useState<number>(initData);

  useEffect(() => {
    // todo 同步更新外部传入hoo的status值
    // todo 如果只需要初始化，可以不监听initData，或者只监听一次变更（当外部传入的status有值时执行setState）
    setTotalCount(initData);
  }, [initData]);
  const handleAddCount = () => {
    setTotalCount((prevState) => {
      return prevState + 100;
    });
  };
  //   const [selectedProduct, setSelectedProduct] = useState(null);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  //
  //   const loadProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchProductList();
  //       setProducts(data);
  //       setError(null);
  //     } catch (err) {
  //       setError("Failed to load products");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   const loadProductDetails = async (productId) => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchProductDetails(productId);
  //       setSelectedProduct(data);
  //       setError(null);
  //     } catch (err) {
  //       setError('Failed to load product details');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  return {
    totalCount,
    handleAddCount,
    //     selectedProduct,
    //     loading,
    //     error,
    //     loadProducts,
    //     loadProductDetails
  };
};
