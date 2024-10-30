import { useProductsStore } from '@/stores/products.store'

export function missingProductsAddition(products) {
  const productStore = useProductsStore()

  let groupsToAdd = []
  let isGroupAdded = false
  for (const [groupIndex, group] of products.entries()) {
    if (!productStore.productsList.find(groupItem => groupItem.id === group.id)) {
      productStore.productsList.push(group)
      isGroupAdded = true
    }
  }
  if (isGroupAdded) {
    productStore.productsList.sort((a,b) => a.order-b.order)
  }

  for (const [groupIndex, group] of products.entries()) {
    let isSubGroupAdded
    for (const [subGroupIndex, subGroup] of group.subGroups) {
      if (!productStore.productsList[groupIndex].subGroups.find(subGroupItem => subGroupItem.id === subGroupItem.id)) {
        isSubGroupAdded = true
        let subGroupToAdd = subGroup
        subGroupToAdd.products = []
        productStore.productsList[groupIndex].subGroups.push(subGroupToAdd)
      }
    }
    if (isSubGroupAdded) {
      productStore.productsList[groupIndex].subGroups.sort((a,b) => a.order - b.order)
    }
  }


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