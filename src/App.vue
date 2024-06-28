<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order.store';
import { useProductsStore } from '@/stores/products.store'

// import { useScreenOrientation } from '@vueuse/core'

// const { isSupported, orientation, angle, lockOrientation, unlockOrientation } =
//   useScreenOrientation()

// document.documentElement.requestFullscreen().then(() => screen.orientation.lock('portrait'))

const isUpdateLocked = ref(false);
const orderStore = useOrderStore();
const productsStore = useProductsStore();

/* Так как нет единого action, приходится слушать апдейт стейта тут */
orderStore.$subscribe(async (data, { preOrder }) => {
  try {
    // isUpdateLocked.value = true;
    const tables = JSON.parse(window.localStorage.getItem('selectedTables'));

    if (tables && (data.events.oldValue === 1 || preOrder.length )) {
      await axios.put('/pre-order', {
        table: tables[0],
        items: preOrder.length ? preOrder : null,
      }).then((response) => {
        console.log('Pre-update resp: ', response);
        isUpdateLocked.value = false;
      });
    }
  } catch (error) {
    console.log('Ошибка синхронизации заказа', error)
  }
});

async function syncOrderData() {
  if (window.localStorage.selectedTables) {
    try {
      const table = JSON.parse(window.localStorage.getItem('selectedTables'));

      if (isUpdateLocked.value) return;

      await axios.get(`/table/check/${table}`).then((response) => {
        if (isUpdateLocked.value) return;

        if (response.data) {
          if (!response.data.preOrder) {
            orderStore.preOrder = [];
          }

          try {
            const preOrderData = JSON.parse(response.data.preOrder || null);
            const orderData = JSON.parse(response.data.order || null);
            const totalAmount = preOrderData ? preOrderData.items.reduce((acc, item) => acc + item.amount, 0) : 0;

            if (response.data.order) {
              orderData.items.forEach((item) => {
                let product;

                productsStore.productsList.forEach((category) => {
                  if (product) return;
                  category.subGroups.forEach((sub) => {
                    if (product) return;
                    product = sub.products.find(({ id }) => item.id === id);
                  })
                });

                if (product) {
                  const productFromStore = orderStore.order.find(({ id }) => item.id === id);

                  if (productFromStore) {
                    productFromStore.amount = item.amount;
                  } else {
                    orderStore.order.push({ ...product, amount: item.amount });
                  }
                }
              });
            }

            if (response.data.preOrder) {
              preOrderData.items.forEach((item) => {
                let product;

                productsStore.productsList.forEach((category) => {
                  if (product) return;
                  category.subGroups.forEach((sub) => {
                    if (product) return;
                    product = sub.products.find(({ id }) => item.id === id);
                  })
                });

                if (product) {
                  const productFromStore = orderStore.preOrder.find(({ id }) => item.id === id);

                  if (productFromStore) {
                    productFromStore.amount = item.amount;
                  } else {
                    orderStore.preOrder.push({ ...product, amount: item.amount });
                  }
                }
              });

              /* 'Если удалили блюдо из списка' */
              if (preOrderData.items.length < orderStore.preOrder.length) {
                console.log('Если удалили блюдо из списка');

                const latestItems = new Set(preOrderData.items.map(({ id }) => id));
                const currentItems = new Set(orderStore.preOrder.map(({ id }) => id));
                const deletedValue = currentItems.difference(latestItems).keys().next().value;

                orderStore.preOrder = orderStore.preOrder.filter(({ id }) => id !== deletedValue);
              }
            }

            if (orderStore.orderInfo.orderAmount !== totalAmount) {
              orderStore.orderInfo = {
                orderAmount: totalAmount
              };
            }

            if (response.data.orderId && orderStore.orderInfo.orderId != response.data.orderId) {
              orderStore.orderInfo.orderId = response.data.orderId;
            }
          } catch (error) {
            console.log('Ошибка парсинга данных синхронизации заказа...', error);
          }
        }
      });
    } catch (error) {
      console.log('Ошибка обновления данных заказа...', error);
    }
  }
}

onMounted(() => {
  const syncTimeInterval = 3000;

  syncOrderData();

  setInterval(syncOrderData, syncTimeInterval);
})
</script>

<style scoped></style>
