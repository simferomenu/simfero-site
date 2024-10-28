import { productParser } from '@/composables/productParser.js'
import { missingProductsAddition } from '@/composables/missingProductsAddition.js'

export function stopListWorkaround(menuProducts) {
  let stopListItems = {}
  for (let product of menuProducts.products) {
    if (product.sizePrices[0].price.currentPrice !== 0 && product.isInStopList) {
      if (!stopListItems[product.parentGroup]) {
        stopListItems[product.parentGroup] = []
      }
      stopListItems[product.parentGroup].push(product)
    }
  }

  for (const [groupIndex, group] of productStore.productsList.entries()) {
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      if (stopListItems[subGroup.id]) {
        let arrayStopListSubGroup = Array.from(stopListItems[subGroup.id])
        let productIndexToRemove = []
        for (const [productIndex, product] of subGroup.products.entries()) {
          if (arrayStopListSubGroup.find(stopListItem => stopListItem.id === product.id)) {
            productIndexToRemove.push(productIndex)
          }
        }
        subGroup.products = subGroup.products.filter((_, index) => !productIndexToRemove.includes(index));
        if (subGroup.products.length == 0) {
          subGroup.isHidded = true
        }
      }
    }
  }

  missingProductsAddition(productParser(menuProducts))
}