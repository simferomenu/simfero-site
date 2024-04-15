import axios from 'axios'

onMounted(() => {
  axios
    .get('/menu')
    // .then((response) => console.log(response))
    .then((response) => {
      const menu = []

      const groups = response.data.groups
      const prod = response.data.products

      prod.forEach((prod) => {
        const groupId = prod.groupId
        const group = groups.find(({ id }) => id === groupId)
        const existingItem = menu.find(({ id }) => id === group.id)

        if (!existingItem) {
          menu.push({
            id: group.id,
            name: group.name,
            products: [prod]
          })
        } else {
          existingItem.products.push(prod)
        }
      })
    })
})
