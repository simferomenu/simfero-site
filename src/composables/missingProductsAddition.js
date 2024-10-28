export function missingProductsAddition(reparsedProducts) {
  for (const [groupIndex, group] of products.entries()) {
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      for (const [productIndex, product] of subGroup.products.entries()) {
        if (!productStore.productsList[groupIndex].subGroups[subGroupIndex].products.filter((piniaProduct) => piniaProduct.id == product.id)) {
          productStore.productsList[groupIndex].subGroups[subGroupIndex].products.push(product)
        }
        if (productStore.productsList[groupIndex].subGroups[subGroupIndex].products.isHidded && productStore.productsList[groupIndex].subGroups[subGroupIndex].products.length>0) {
          productStore.productsList[groupIndex].subGroups[subGroupIndex].products.isHidded = false
        }
      }
      productStore.productsList[groupIndex].subGroups[subGroupIndex].products.sort((a, b) => a.order - b.order)
    }
  }
}