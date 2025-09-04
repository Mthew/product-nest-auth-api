import { apiService } from "@/services/api.service";

// Test script to verify API integration
async function testProductAPI() {
  console.log("🧪 Testing Product API Integration...\n");

  try {
    // 1. Test fetching all products
    console.log("1. Fetching all products...");
    const products = await apiService.products.getAll();
    console.log(`✅ Found ${products.length} products:`, products);

    // 2. Test creating a product (Note: This requires Admin role)
    console.log("\n2. Testing product creation...");
    const testProduct = {
      name: "Test Agricultural Seed",
      description: "High-quality test seeds for farming",
      price: 25.99,
      category: "Seeds",
      stock: 100,
    };

    try {
      const newProduct = await apiService.products.create(testProduct);
      console.log("✅ Product created successfully:", newProduct);

      // 3. Test updating the product
      console.log("\n3. Testing product update...");
      const updatedProduct = await apiService.products.update(newProduct.id, {
        price: 29.99,
        stock: 95,
      });
      console.log("✅ Product updated successfully:", updatedProduct);

      // 4. Test fetching by ID
      console.log("\n4. Testing fetch by ID...");
      const fetchedProduct = await apiService.products.getById(newProduct.id);
      console.log("✅ Product fetched by ID:", fetchedProduct);

      // 5. Test deleting the product
      console.log("\n5. Testing product deletion...");
      await apiService.products.delete(newProduct.id);
      console.log("✅ Product deleted successfully");
    } catch (createError: any) {
      if (
        createError.message?.includes("Unauthorized") ||
        createError.message?.includes("Forbidden")
      ) {
        console.log(
          "⚠️ Product creation/modification requires authentication (Admin role)"
        );
        console.log(
          "📝 Note: You need to log in first to test CRUD operations"
        );
      } else {
        console.error("❌ Error during CRUD operations:", createError.message);
      }
    }
  } catch (error: any) {
    console.error("❌ Error during API test:", error.message);
  }

  console.log("\n🏁 API Integration test completed!");
}

export { testProductAPI };
