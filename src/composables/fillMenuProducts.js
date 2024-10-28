import { ref } from 'vue'

const propertiesToRemove = [
  'energyAmount',
  'fatFullAmount',
  'proteinsFullAmount',
  'carbohydratesFullAmount',
  'energyFullAmount',
  'groupId',
  'productCategoryId',
  'type',
  'orderItemType',
  'splittable',
  'measureUnit',
  'fullNameEnglish',
  'useBalanceForSell',
  'canSetOpenPrice',
  'paymentSubject',
  'doNotPrintInCheque',
  'code',
  'tags',
  'isDeleted',
  'seoDescription',
  'seoText',
  'seoKeywords',
  'seoTitle'
]

const isUpperCase = (str) => {
  return str === str.toUpperCase()
}

// Reset Pinia
// businessStore.businessOrder = []
// businessStore.finalCost = 0

// Business Store Push
// businessLunchGroupIndex.value = productsList.value
//   .map((e) => e.id)
//   .indexOf('d9b01578-bd7f-4934-bf6e-2806900c3e1f')
// businessStore.businessProducts = productsList.value[businessLunchGroupIndex.value]

// Business Store day filter
// businessStore.businessProducts.subGroups.forEach((subGroup, subGroupIndex) => {
//   subGroup.products.forEach((product, productIndex) => {
//     product.subGroupIndex = subGroupIndex
//     product.productIndex = productIndex
//   })
// })
//
// businessStore.businessProducts.subGroups.forEach((subGroup) => {
//   subGroup.daysOfWeek.forEach((day, dayIndex) => {
//     day.forEach((product, productIndex) => {
//       product.dayIndex = dayIndex
//       product.productIndex = productIndex
//     })
//   })
// })

// Day Filter business Store
// for (const subGroup of businessStore.businessProducts.subGroups) {
//   subGroup.daysOfWeek = []
//   for (let i = 0; i < daysOfWeekArr.length; i++) {
//     subGroup.daysOfWeek.push(
//       subGroup.products
//         .filter((product) => product.additionalInfo != null)
//         .filter((product) => product.additionalInfo.includes(daysOfWeekArr[i]))
//     )
//     const filterNoDay = subGroup.products
//       .filter((product) => product.additionalInfo == null)
//       .filter((product) => product.name != null)
//     if (filterNoDay.length != 0) {
//       subGroup.daysOfWeek[i].push(...filterNoDay)
//     }
//   }
// }

// Clear productsList from business products
// productsList.value.splice(businessLunchGroupIndex.value, 1)

// Move products to productStore
// productsStore.productsList = productsList.value


export function productParser(partial, menuProducts) {

  menuProducts.products = menuProducts.products.filter(
    (product) => product.sizePrices[0].price.currentPrice != 0
  )

  window.localStorage.setItem('menu', JSON.stringify(menuProducts.products))

  const groups = ref(menuProducts.groups)
  for (const group of groups.value) {
    if (group.parentGroup == null && isUpperCase(group.name) == true) {
      productsList.value.push(group)
    }
  }

  for (let group of productsList.value) {
    subGroupIndexRemove.value = []
    const subGroups = menuProducts.groups.filter(
      (subGroup) => subGroup.parentGroup === group.id
    )
    if (subGroups.length != 0) {
      group.subGroups = subGroups
    } else {
      group.subGroups = [
        {
          name: group.name,
          products: menuProducts.products
            .filter((subGroup) => subGroup.parentGroup === group.id)
            .sort((a, b) => a.order - b.order)
        }
      ]
    }
    // Fill sub with products
    for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
      subGroup.name = subGroup.name.replace('ДЕЛОВЫЕ ОБЕДЫ', '').replace(' ДО', '')
      const products = menuProducts.products
        .filter((product) => product.parentGroup === subGroup.id)
        .sort((a, b) => a.order - b.order)
      const subSubGroups = menuProducts.groups.filter(
        (subSubGroups) => subSubGroups.parentGroup === subGroup.id
      )
      if (subSubGroups.length !== 0) {
        for (let subSubGroup of subSubGroups) {
          subSubGroup.newParentGroup = group.id
        }
        group.subGroups.push(...subSubGroups)
      }
      if (products.length !== 0) {
        subGroup.products = products.sort((a, b) => a.order - b.order)
      }
      if (subGroup.products == null) {
        subGroupIndexRemove.value.push(subGroupIndex)
      }
    }
    if (group.subGroups.length == 1 && group.subGroups[0].products.length == 0) {
      groupIndexRemove.value.push(productsList.value.indexOf(group))
    }
    group.subGroups = group.subGroups.filter(
      (_, index) => !subGroupIndexRemove.value.includes(index)
    )
    group.subGroups.sort((a, b) => a.order - b.order)
  }
  productsList.value = productsList.value.filter(
    (_, index) => !groupIndexRemove.value.includes(index)
  )

  // Groups Sort
  productsList.value.sort((a, b) => a.order - b.order)

  // Set right weight measure unit
  productsList.value.forEach((group) => {
    if (drinksGroupsId.includes(group.id)) {
      group.subGroups.forEach((subGroup) => {
        subGroup.products.forEach((product) => {
          if (product.weight != 0 && product.weight != null) {
            if (product.weight * 1000 >= 1000) {
              product.weightMeasure = 'л.'
            } else {
              product.weight = product.weight * 1000
              product.weightMeasure = 'мл.'
            }
          }
        })
      })
    }
    if (!drinksGroupsId.includes(group.id)) {
      group.subGroups.forEach((subGroup) => {
        if (subGroup.id != 'a4411b8a-76ef-4364-afc9-11387256de9f') {
          subGroup.products.forEach((product) => {
            product.weightMeasure = 'г.'
            product.weight = (product.weight * 1000).toFixed(0)
          })
        } else if (subGroup.id == 'a4411b8a-76ef-4364-afc9-11387256de9f') {
          subGroup.products.forEach((product) => {
            if (product.weight != 0 && product.weight != null) {
              if (product.weight * 1000 >= 1000) {
                product.weightMeasure = 'л.'
              } else {
                product.weight = product.weight * 1000
                product.weightMeasure = 'мл.'
              }
            }
          })
        }
      })
    }
  })

  for (const group of productsList.value) {
    group.subGroups = group.subGroups.filter((subGroup) => !subGroup.name.includes('ДОПЫ'))
  }
}