import { useProductsStore } from '@/stores/products.store.js'

const productStore = useProductsStore()

export function missingProductsAddition(reparsedProducts) {
  for (const [groupIndex, group] of reparsedProducts.products.entries()) {
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      for (const [productIndex, product] of subGroup.products.entries()) {
        if (!productStore.productsList[groupIndex].subGroups[subGroupIndex].products.filter((piniaProduct) => piniaProduct.id == product.id)) {
          console.log(`missing product - ${product}`)
          productStore.productsList[groupIndex].subGroups[subGroupIndex].products.push(product)
        }
      }
      productStore.productsList[groupIndex].subGroups[subGroupIndex].products.sort((a, b) => a.order - b.order)
    }
  }
}