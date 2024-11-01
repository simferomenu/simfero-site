import { productParser } from '@/composables/productParser.js'
import { missingProductsAddition } from '@/composables/missingProductsAddition.js'
import { useProductsStore } from '@/stores/products.store'

export function stopListWorkaround(menuProducts) {
  const productsStore = useProductsStore()

  let stopListItems = {}
  for (let product of menuProducts.products) {
    if (product.sizePrices[0].price.currentPrice !== 0 && product.isInStopList) {
      if (!stopListItems[product.parentGroup]) {
        stopListItems[product.parentGroup] = []
      }
      stopListItems[product.parentGroup].push(product)
    }
  }

  let groupsToRemove = []
  for (const [groupIndex, group] of productsStore.productsList.entries()) {
    let subGroupsToRemove = []
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      if (stopListItems[subGroup.id]) {
        let arrayStopListSubGroup = Array.from(stopListItems[subGroup.id])
        for (let i=0; i<arrayStopListSubGroup.length; i++) {
          subGroup.products = subGroup.products.filter((product) => product.id !== arrayStopListSubGroup[i].id)
        }
        if (subGroup.products.length === 0) {
          subGroupsToRemove.push(subGroupIndex)
        }
      }
    }
    for (let i = subGroupsToRemove.length -1; i >= 0; i--) {
      group.subGroups.splice(subGroupsToRemove[i],1);
    }

    if (group.subGroups.length === 0) {
      groupsToRemove.push(groupIndex)
    }
  }
  for (let i = groupsToRemove.length -1; i >= 0; i--) {
    productsStore.productsList.splice(groupsToRemove[i],1);
  }

  missingProductsAddition(productParser(menuProducts).products)

  // if (stopListItems["d9b01578-bd7f-4934-bf6e-2806900c3e1f"]) {
  //   let arrayStopListSubGroup = Array.from(stopListItems["d9b01578-bd7f-4934-bf6e-2806900c3e1f"])
  //   let productIndexToRemove = []
  //   for (const [subGroupIndex, subGroup] of businessStore.businessProducts.subGroups.entries()) {
  //     for (const [productIndex, product] of subGroup.products.entries()) {
  //       if (arrayStopListSubGroup.find(stopListItem => stopListItem.id === product.id)) {
  //         productIndexToRemove.push(productIndex)
  //       }
  //     }
  //     subGroup.products = subGroup.products.filter((_, index) => !productIndexToRemove.includes(index));
  //   }
  // }
  // missingBusinessProductsAddition(reparsedProducts.businessProducts)
}

