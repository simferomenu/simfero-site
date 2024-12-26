import { propertiesToRemove, daysOfWeek, drinksGroupsId } from '@/constants/parserConfig.json'
import { ref } from 'vue'
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

  menuProducts.products = menuProducts.products.filter(
    (product) => product.sizePrices[0].price.currentPrice !== 0
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
    if (subGroups.length !== 0) {
      group.subGroups = subGroups
    } else {
      let products = menuProducts.products.filter((product) => product.parentGroup === group.id)
      if (products.length !== 0) {
        group.subGroups = [
          {
            name: group.name,
            id: group.id
          }
        ]
      } else {
        groupsToRemove.push(group.id)
      }
    }
  }

  productsList = productsList.filter((group) => !groupsToRemove.includes(group.id))

  // SubSubGroups
  for (let group of productsList) {
    for (let subGroup of group.subGroups) {
      let subSubGroups = menuProducts.groups.filter(
        (subSubGroup) => subSubGroup.parentGroup === subGroup.id
      )
      if (subSubGroups.length !== 0) {
        for (let subSubGroup of subSubGroups) {
          subSubGroup.parentGroup = group.id
        }
        group.subGroups.push(...subSubGroups)
      }
    }
    group.subGroups = group.subGroups.sort((a, b) => a.order - b.order)
  }

  productsList = productsList.sort((a, b) => a.order - b.order)

  // Fill sub with products

  for (let group of productsList) {
    for (let subGroup of group.subGroups) {
      subGroup.products = menuProducts.products.filter(
        (product) => product.parentGroup === subGroup.id
      )
    }
  }

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
    for (let i = 0; i < daysOfWeek.length; i++) {
      subGroup.daysOfWeek.push(
        subGroup.products
          .filter((product) => product.additionalInfo != null)
          .filter((product) => product.additionalInfo.includes(daysOfWeek[i]))
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

  return { products: productsList, businessProducts: businessProducts }
}
