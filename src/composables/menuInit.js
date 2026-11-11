import axios from 'axios'
import { productParser } from '@/composables/productParser.js'
import { useProductsStore } from '@/stores/products.store.js'
import { useBusinessStore } from '@/stores/business.store.js'

export async function menuInit() {
  const productStore = useProductsStore()
  const businessStore = useBusinessStore()

  if (productStore.isStopListIsParsing) return

  const selectedTables = JSON.parse(window.localStorage.getItem('selectedTables') || '[]')
  const table = selectedTables[0]
  if (!table) return

  productStore.isStopListIsParsing = true
  try {
    const infoResponse = await axios.get(`/info/:${table}`)
    const nextMenuVersion = infoResponse.data.menuVersion.value
    const currentMenuVersion = window.localStorage.getItem('menuVersion') || ''

    if (currentMenuVersion === nextMenuVersion) return

    const menuResponse = await axios.get('/menu')
    const renderedSubGroups = new Set(
      productStore.productsList
        .flatMap((group) => group.subGroups)
        .filter((subGroup) => subGroup.products.some((product) => product.isRendered))
        .map((subGroup) => subGroup.id)
    )
    const parsedMenu = productParser(menuResponse.data)

    parsedMenu.products.forEach((group) => {
      group.subGroups.forEach((subGroup) => {
        subGroup.products.forEach((product) => {
          product.isRendered = renderedSubGroups.has(subGroup.id)
        })
      })
    })

    productStore.setProductsList(parsedMenu.products)
    businessStore.businessProducts = parsedMenu.businessProducts
    window.localStorage.setItem('menu', JSON.stringify(menuResponse.data.products))
    window.localStorage.setItem('menuVersion', nextMenuVersion)
  } catch (error) {
    console.log('Ошибка автоматического обновления меню', error)
  } finally {
    productStore.isStopListIsParsing = false
  }
}