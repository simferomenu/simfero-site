import { useProductsStore } from '@/stores/products.store'

export function missingProductsAddition(products) {
  const productStore = useProductsStore()

  let isGroupAdded = false
  for (const [groupIndex, group] of products.entries()) {
    if (!productStore.productsList.find(groupItem => groupItem.id === group.id)) {
      let groupToAdd = group
      groupToAdd.subGroups=[]
      productStore.productsList.splice(groupIndex, 0, groupToAdd)
      isGroupAdded = true
    }
  }
  // if (isGroupAdded) {
  //   productStore.productsList.sort((a,b) => a.order-b.order)
  // }

  for (const [groupIndex, group] of products.entries()) {
    let isSubGroupAdded = false
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      if (!productStore.productsList[groupIndex].subGroups.find(subGroupItem => subGroupItem.id === subGroup.id)) {
        isSubGroupAdded = true
        let subGroupToAdd = subGroup
        subGroupToAdd.products = []
        if (productStore.productsList[groupIndex].subGroups.length === 0) {
          productStore.productsList[groupIndex].subGroups.push(subGroupToAdd)
        } else {
          productStore.productsList[groupIndex].subGroups.splice(subGroupIndex, 0, subGroupToAdd)
        }
      }
    }
    // if (isSubGroupAdded) {
    //   productStore.productsList[groupIndex].subGroups.sort((a,b) => a.order - b.order)
    // }
  }


  for (const [groupIndex, group] of products.entries()) {
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      if (productStore.productsList[groupIndex].subGroups[subGroupIndex].products.length === 0) {
        productStore.productsList[groupIndex].subGroups[subGroupIndex].products = subGroup.products
      } else {
        for (const [productIndex, product] of subGroup.products.entries()) {
          if (!productStore.productsList[groupIndex].subGroups[subGroupIndex].products.filter((piniaProduct) => piniaProduct.id === product.id)) {
            productStore.productsList[groupIndex].subGroups[subGroupIndex].products.push(product)
          }
        }
      }
      productStore.productsList[groupIndex].subGroups[subGroupIndex].products.sort((a, b) => a.order - b.order)
    }
  }
}