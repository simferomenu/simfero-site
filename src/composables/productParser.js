import { propertiesToRemove, daysOfWeek, drinksGroupsId } from '@/constants/parserConfig.json'
const isUpperCase = (str) => {
  return str === str.toUpperCase()
}

export function productParser(menuProducts) {
  let productsList = []
  menuProducts.products.forEach((product) => {
    propertiesToRemove.forEach((prop) => {
      delete product[prop]
    })
    product.isRendered = false
    product.amount = 0
    product.name = product.name.replace('ДЕЛОВЫЕ ОБЕДЫ', '').replace('ДО ', '')
  })

  menuProducts.products = menuProducts.products.filter((product) => {
    return product.isInStopList !== true
  })

  var businessLunchGroup = menuProducts.groups.find((group) => group.name === 'ДЕЛОВЫЕ ОБЕДЫ').id

  menuProducts.products = menuProducts.products.filter(
    (product) =>
      product.parentGroup === businessLunchGroup || product.sizePrices[0].price.currentPrice !== 0
  )

  var groups = menuProducts.groups
  for (const group of groups) {
    if (group.parentGroup === null && isUpperCase(group.name) == true) {
      productsList.push(group)
    }
  }

  let groupsToRemove = []

  for (let group of productsList) {
    let subGroups = menuProducts.groups.filter((subGroup) => subGroup.parentGroup === group.id)
    group.subGroups = []
    if (subGroups.length !== 0) {
      group.subGroups.push(...subGroups)
    }
    if (menuProducts.products.filter((product) => product.parentGroup === group.id).length !== 0) {
      group.subGroups.push({ name: group.name, id: group.id })
    }
    if (group.subGroups.length === 0) {
      groupsToRemove.push(group.id)
    }
  }

  productsList = productsList.filter((group) => !groupsToRemove.includes(group.id))
  productsList = productsList.sort((a, b) => a.order - b.order)
  groupsToRemove = []

  // SubSubGroups
  for (let group of productsList) {
    for (let subGroup of group.subGroups) {
      let subSubGroups = menuProducts.groups.filter(
        (subSubGroup) => subSubGroup.parentGroup === subGroup.id && subGroup.id !== group.id
      )
      if (
        subSubGroups.length !== 0 ||
        subSubGroups.findIndex((subSubGroup) => {
          subSubGroup.name === group.name
        }) === -1
      ) {
        subSubGroups = subSubGroups.sort((a, b) => a.order - b.order)
        group.subGroups.push(...subSubGroups)
      }
    }
    group.subGroups = group.subGroups.sort((a, b) => a.order - b.order)
  }

  productsList = productsList.sort((a, b) => a.order - b.order)

  // Fill sub with products

  for (let group of productsList) {
    let subGroupsToRemove = []
    for (let subGroup of group.subGroups) {
      let products = menuProducts.products.filter((product) => product.parentGroup === subGroup.id)
      if (products.length === 0) {
        subGroupsToRemove.push(subGroup.id)
      } else {
        subGroup.products = products
        subGroup.products = subGroup.products.sort((a, b) => a.order - b.order)
      }
    }
    group.subGroups = group.subGroups.filter((subGroup) => !subGroupsToRemove.includes(subGroup.id))
    if (group.subGroups.length === 0) {
      groupsToRemove.push(group.id)
    }
  }

  productsList.filter((group) => !groupsToRemove.includes(group.id))

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

  var businessLunchGroupIndex = productsList.map((e) => e.name).indexOf('ДЕЛОВЫЕ ОБЕДЫ')

  if (businessLunchGroupIndex !== -1) {
    var businessProducts = productsList[businessLunchGroupIndex]

    for (const subGroup of businessProducts.subGroups) {
      subGroup.daysOfWeek = []
      for (let i = 0; i < daysOfWeek.length; i++) {
        subGroup.daysOfWeek.push(
          subGroup.products
            .filter((product) => product.additionalInfo != null)
            .filter((product) => product.additionalInfo.toLowerCase().includes(daysOfWeek[i]))
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
  }

  for (const group of productsList) {
    group.subGroups = group.subGroups.filter((subGroup) => !subGroup.name.includes('ДОПЫ'))
  }

  return { products: productsList, businessProducts: businessProducts || null }
}
