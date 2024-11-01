import { useProductsStore } from '@/stores/products.store'

export function missingProductsAddition(products) {
  const productStore = useProductsStore()

  let isGroupAdded = false
  for (const [groupIndex, group] of products.entries()) {
    if (!productStore.productsList.find(groupItem => groupItem.id === group.id)) {
      productStore.productsList.splice(groupIndex, 0, group)
    }
  }

  for (const [groupIndex, group] of products.entries()) {
    let isSubGroupAdded = false
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      if (!productStore.productsList[groupIndex].subGroups.find(subGroupItem => subGroupItem.id === subGroup.id)) {
        productStore.productsList[groupIndex].subGroups.splice(subGroupIndex, 0, subGroup)
      }
    }
  }


  for (const [groupIndex, group] of products.entries()) {
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
        for (const [productIndex, product] of subGroup.products.entries()) {
          if (productStore.productsList[groupIndex].subGroups[subGroupIndex].products.filter(piniaProduct => piniaProduct.id === product.id).length === 0) {
            product.isRendered = true
            productStore.productsList[groupIndex].subGroups[subGroupIndex].products.splice(productIndex, 0, product)
          }
        }
    }
  }
  productStore.isStopListIsParsing = false
  console.log('Stop List workaround is done')
}