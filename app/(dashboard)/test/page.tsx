import { fetchBrands } from '@/lib/ecmManager';
import React from 'react'


const page = () => {

  
  const testFetch = async () => {
    const brands = await fetchBrands();
    console.log("Fetched brands:", brands);
  
    // const conditions = await fetchConditions();
    // console.log("Fetched conditions:", conditions);
  
    // const topics = await fetchTopics();
    // console.log("Fetched topics:", topics);
  
    // const products = await fetchProducts();
    // console.log("Fetched products:", products);
  };
  
  testFetch();
  
  return (
    <div>
      <h2>Check console</h2>
    </div>
  )
}

export default page
