export function businessProductsDaysFill() {
  for (const subGroup of businessStore.businessProducts.subGroups) {
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

  businessStore.businessProducts.subGroups.forEach((subGroup, subGroupIndex) => {
    subGroup.products.forEach((product, productIndex) => {
      product.subGroupIndex = subGroupIndex
      product.productIndex = productIndex
    })
  })

  businessStore.businessProducts.subGroups.forEach((subGroup) => {
    subGroup.daysOfWeek.forEach((day, dayIndex) => {
      day.forEach((product, productIndex) => {
        product.dayIndex = dayIndex
        product.productIndex = productIndex
      })
    })
  })
}