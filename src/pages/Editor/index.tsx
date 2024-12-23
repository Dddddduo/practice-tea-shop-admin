import React from 'react';

import WangEditor from "@/pages/Editor/components/WangEditor";

const API_URL = process.env.REACT_APP_API_URL || 'https://api.yourbackend.com';

const ProductDetailPage = () => {
  return (
    <div>
      <h1>编辑商品详情</h1>
      <WangEditor/>
    </div>
  );
};

export default ProductDetailPage;
