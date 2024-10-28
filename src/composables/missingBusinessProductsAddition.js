import { businessProductsDaysFill } from '@/composables/businessProductsDaysFill.js'

export function missingBusinessProductsAddition(reparsedProducts) {
  let smthChanged = false
  for (const [subGroupIndex, subGroup] of reparsedProducts.subGroups.entries()) {
    for (const [productIndex, product] of subGroup.products.entries()) {
      if (!businessStore.businessProducts[subGroupIndex].products.filter((piniaProduct) => piniaProduct.id == product.id)) {
        smthChanged = true
        businessStore.businessProducts[subGroupIndex].products.push(product)
      }
    }
    businessStore.businessProducts[subGroupIndex].products.sort((a, b) => a.order - b.order)
  }
  if (smthChanged === true) {
    businessProductsDaysFill()
  }
}