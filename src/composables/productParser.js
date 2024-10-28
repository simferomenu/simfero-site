const daysOfWeekArr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']

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

const drinksGroupsId = [
  'f53b9025-673c-41ef-a1b3-02fddee5fbbc',
  '1e815609-ed6a-466d-9914-bc9ca89a3761',
  '606700d7-17e3-46b5-b753-900f279f9522'
]

export function productParser(menuProducts) {
  var productsList = []
  var subGroupIndexRemove = []
  var groupIndexRemove = []
  var productsInStopListIndexes = []

  menuProducts.products.forEach((product, productIndex) => {
    propertiesToRemove.forEach((prop) => {
      delete product[prop]
    })
    product.isRendered = false
    product.amount = 0
    product.name = product.name.replace('ДЕЛОВЫЕ ОБЕДЫ', '').replace('ДО ', '')
    if (product.isInStopList) {
      productsInStopListIndexes.push(productIndex)
    }
  })

  menuProducts.products = menuProducts.products.filter((_, index) => !productsInStopListIndexes.includes(index));

  menuProducts.products = menuProducts.products.filter(
    (product) => product.sizePrices[0].price.currentPrice != 0
  )

  var groups = (menuProducts.groups)
  for (const group of groups) {
    if (group.parentGroup == null && isUpperCase(group.name) == true) {
      productsList.push(group)
    }
  }

  for (let group of productsList) {
    subGroupIndexRemove = []
    const subGroups = menuProducts.groups.filter(
      (subGroup) => subGroup.parentGroup === group.id
    )
    if (subGroups.length != 0) {
      group.subGroups = subGroups
    } else {
      group.subGroups = [
        {
          name: group.name,
          id: group.id,
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
      // Move subSubGroups to subGroups
      if (subSubGroups.length !== 0) {
        for (let subSubGroup of subSubGroups) {
          subSubGroup.parentGroup = group.id
        }
        group.subGroups.push(...subSubGroups)
      }
      if (products.length !== 0) {
        subGroup.products = products.sort((a, b) => a.order - b.order)
      }
      if (subGroup.products == null) {
        subGroupIndexRemove.push(subGroupIndex)
      }
    }
    if (group.subGroups.length == 1 && group.subGroups[0].products.length == 0) {
      groupIndexRemove.push(productsList.indexOf(group))
    }
    group.subGroups = group.subGroups.filter(
      (_, index) => !subGroupIndexRemove.includes(index)
    )
    group.subGroups.sort((a, b) => a.order - b.order)
  }
  productsList = productsList.filter(
    (_, index) => !groupIndexRemove.includes(index)
  )

  productsList.sort((a, b) => a.order - b.order)

  productsList.forEach((group) => {
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

  var businessLunchGroupIndex = productsList
    .map((e) => e.id)
    .indexOf('d9b01578-bd7f-4934-bf6e-2806900c3e1f')
  var businessProducts = productsList[businessLunchGroupIndex]

  for (const subGroup of businessProducts.subGroups) {
    subGroup.daysOfWeek = []
    for (let i = 0; i < daysOfWeekArr.length; i++) {
      subGroup.daysOfWeek.push(
        subGroup.products
          .filter((product) => product.additionalInfo != null)
          .filter((product) => product.additionalInfo.includes(daysOfWeekArr[i]))
      )
      const filterNoDay = subGroup.products
        .filter((product) => product.additionalInfo == null)
        .filter((product) => product.name != null)
      if (filterNoDay.length != 0) {
        subGroup.daysOfWeek[i].push(...filterNoDay)
      }
    }
  }

  businessProducts.subGroups.forEach((subGroup, subGroupIndex) => {
    subGroup.products.forEach((product, productIndex) => {
      product.subGroupIndex = subGroupIndex
      product.productIndex = productIndex
    })
  })

  businessProducts.subGroups.forEach((subGroup) => {
    subGroup.daysOfWeek.forEach((day, dayIndex) => {
      day.forEach((product, productIndex) => {
        product.dayIndex = dayIndex
        product.productIndex = productIndex
      })
    })
  })

  productsList.splice(businessLunchGroupIndex, 1)

  for (const group of productsList) {
    group.subGroups = group.subGroups.filter((subGroup) => !subGroup.name.includes('ДОПЫ'))
  }

  return { products:productsList, businessProducts:businessProducts }
}