import {
  SHOW_PRODUCT_PENDING,
  SHOW_PRODUCT_ERROR,
  SHOW_PRODUCT_SUCCESS,
  SHOW_MODIFIERS_SUCCESS,
  SAVE_CART,
  SHOW_SALESTYPE_SUCCESS,
  SHOW_ACTIVE_TAXES_SUCCESS,
  SHOW_ACTIVE_LATEST_DISCOUNT_SUCCESS,
  SHOW_OUTLETS_SUCCESS,
  SHOW_PROFILE_SUCCESS,
  SHOW_SALES_SUCCESS,
  SET_SUMMARY_ORDER_CART,
  SHOW_SUBDISTRICS_SUCCESS,
  SHOW_SHIPMENT_COST_SUCCESS,
  SAVE_CHECKOUT_DATA,
  SET_NOTIFICATION_DATA,
  SET_ONLINE_STORE_DATA,
  SET_ONLINE_STORE_USER_ID,
  SHOW_ORDER_SUCCESS,
  SHOW_LOGISTICS_SUCCESS,
  SHOW_ONLINE_PAYMENTS_SUCCESS,
  SET_COUNTER_VALUE,
} from "./types";

import { BACKEND_URL, BACKEND_AUTH_HEADER } from '../firebase/config';

/*
export const showProducts = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api product show start --->', BACKEND_URL + 'products/show', data)

        fetch(BACKEND_URL + 'products/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((productsResponse) => productsResponse.json())
          .then((productsData) => {

            dispatch(showProductSuccess(productsData))

          })
          .catch((errorProducts) => {
            dispatch(showProductError(errorProducts))
            console.log('------> showProducts error: ', errorProducts)
          });

    }
}*/


export const showProducts = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('FIND BUG call api product show start --->', BACKEND_URL + 'products/show', data)

        fetch(BACKEND_URL + 'products/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((productsResponse) => productsResponse.json())
          .then((productsData) => {

            console.log('FIND BUG productsData OUT --->', productsData)

              fetch(BACKEND_URL + 'activelatestdiscounts/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({user_id: data.user_id, outlet_id: data.outlet_id})})
                .then((discountsResponse) => discountsResponse.json())
                .then((discountsData) => {

                  fetch(BACKEND_URL + 'activetaxes/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({user_id: data.user_id, outlet_id: data.outlet_id})})
                    .then((taxesResponse) => taxesResponse.json())
                    .then((taxesData) => {

                      fetch(BACKEND_URL + 'salestype/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({user_id: data.user_id, outlet_id: data.outlet_id})})
                        .then((salestypeResponse) => salestypeResponse.json())
                        .then((salestypeData) => {

                          console.log('FIND BUG productsData IN --->', productsData)

                            dispatch(showSalesTypeSuccess(salestypeData))
                            dispatch(showActiveTaxesSuccess(taxesData))
                            dispatch(showLatestActiveDiscountSuccess(discountsData))
                            dispatch(showProductSuccess(productsData))

                        })
                        .catch((errorSalestype) => {
                          dispatch(showProductError(errorSalestype))
                          console.log('------> showSalesType error: ', errorSalestype)
                        });

                    })
                    .catch((errorTaxes) => {
                      dispatch(showProductError(errorTaxes))
                      console.log('------> showTaxes error: ', errorTaxes)
                    });

                })
                .catch((errorDiscounts) => {
                  dispatch(showProductError(errorDiscounts))
                  console.log('------> showDiscounts error: ', errorDiscounts)
                });

          })
          .catch((errorProducts) => {
            dispatch(showProductError(errorProducts))
            console.log('------> showProducts error: ', errorProducts)
          });

    }
}

export const showModifiers = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api modifiers show start --->', BACKEND_URL + 'modifiers/show')

        fetch(BACKEND_URL + 'modifiers/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((modifiersResponse) => modifiersResponse.json())
          .then((modifiersData) => {

            dispatch(showModifiersSuccess(modifiersData))

          })
          .catch((errorModifiers) => {
            dispatch(showProductError(errorModifiers))
            console.log('------> showModifiers error: ', errorModifiers)
          });

    }
}

export const showOutlets = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api outlet show start --->', BACKEND_URL + 'outlets/show')

        fetch(BACKEND_URL + 'outlets/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((outletsResponse) => outletsResponse.json())
          .then((outletsData) => {

            dispatch(showOutletsSuccess(outletsData))

          })
          .catch((errorOutlets) => {
            dispatch(showProductError(errorOutlets))
            console.log('------> showOutlets error: ', errorOutlets)
          });
    }
}

export const showProfile = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api profile show start --->', BACKEND_URL + 'profile/show')

        fetch(BACKEND_URL + 'profile/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((profileResponse) => profileResponse.json())
          .then((profileData) => {

            dispatch(showProfileSuccess(profileData))

          })
          .catch((errorProfile) => {
            dispatch(showProductError(errorProfile))
            console.log('------> showProfile error: ', errorProfile)
          });
    }
}

export const showSales = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api showSales show start --->', BACKEND_URL + 'salesweb/show')

        fetch(BACKEND_URL + 'salesweb/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((salesResponse) => salesResponse.json())
          .then((salesData) => {

            dispatch(showSalesSuccess(salesData))

          })
          .catch((errorSales) => {
            dispatch(showProductError(errorSales))
            console.log('------> showSales error: ', errorSales)
          });
    }
}

export const showSubdistrics = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('call api showSubdistrics show start --->', BACKEND_URL + 'subdistrics/show')

        fetch(BACKEND_URL + 'subdistrics/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((subdistricsResponse) => subdistricsResponse.json())
          .then((subdistricsData) => {

            dispatch(showSubdistricsSuccess(subdistricsData))

          })
          .catch((errorSubdistric) => {
            dispatch(showProductError(errorSubdistric))
            console.log('------> showSubdistrics error: ', errorSubdistric)
          });
    }
}

export const showShipmentCost = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('ARTAKA call api showShipmentCost show start --->', BACKEND_URL + 'shipment/show')

        fetch(BACKEND_URL + 'shipment/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((shipmentResponse) => shipmentResponse.json())
          .then((shipmentData) => {

            dispatch(showShipmentCostSuccess(shipmentData))

          })
          .catch((errorShipment) => {
            dispatch(showProductError(errorShipment))
            console.log('------> ARTAKA showShipmentCost error: ', errorShipment)
          });
    }
}

export const showOrder = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('ARTAKA call api showOrder show start --->', BACKEND_URL + 'onlineorder/show')

        fetch(BACKEND_URL + 'onlineorder/show?inv=' + data.sales_id + '&id=' + data.user_id, { method: 'GET', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}})
          .then((orderResponse) => orderResponse.json())
          .then((orderData) => {

            dispatch(showOrderSuccess(orderData))

          })
          .catch((errorShowOrder) => {
            dispatch(showProductError(errorShowOrder))
            console.log('------> ARTAKA ShowOrder error: ', errorShowOrder)
          });
    }
}

export const showLogistics = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('ARTAKA call api showLogistics show start --->', BACKEND_URL + 'logistics/show')

        fetch(BACKEND_URL + 'logistics/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((logisticsResponse) => logisticsResponse.json())
          .then((logisticsData) => {

            dispatch(showLogisticsSuccess(logisticsData))

          })
          .catch((errorLogistics) => {
            dispatch(showProductError(errorLogistics))
            console.log('------> ARTAKA showLogistics error: ', errorLogistics)
          });
    }
}

export const showOnlinePaymets = (data) => {
    return dispatch => {
        dispatch(showProductPending())
        console.log('ARTAKA call api showOnlinePaymets show start --->', BACKEND_URL + 'onlinepayments/show')

        fetch(BACKEND_URL + 'onlinepayments/show', { method: 'POST', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(data)})
          .then((onlinepaymentsResponse) => onlinepaymentsResponse.json())
          .then((onlinepaymentsData) => {

            dispatch(showOnlinePaymentsSuccess(onlinepaymentsData))

          })
          .catch((errorOnlinepayments) => {
            dispatch(showProductError(errorOnlinepayments))
            console.log('------> ARTAKA showOnlinePaymets error: ', errorOnlinepayments)
          });
    }
}

export const showProductPending = () => ({
    type: SHOW_PRODUCT_PENDING
})

export const showProductError = (error) => ({
    type: SHOW_PRODUCT_ERROR,
    error: error
})

export const showProductSuccess = (data) => ({
    type: SHOW_PRODUCT_SUCCESS,
    data: data,
})

export const showModifiersSuccess = (data) => ({
    type: SHOW_MODIFIERS_SUCCESS,
    data: data
})

export const saveCart = (data) => ({
    type: SAVE_CART,
    data: data
})

export const showSalesTypeSuccess = (data) => ({
    type: SHOW_SALESTYPE_SUCCESS,
    data: data
})

export const showActiveTaxesSuccess = (data) => ({
    type: SHOW_ACTIVE_TAXES_SUCCESS,
    data: data
})

export const showLatestActiveDiscountSuccess = (data) => ({
    type: SHOW_ACTIVE_LATEST_DISCOUNT_SUCCESS,
    data: data
})

export const showOutletsSuccess = (data) => ({
    type: SHOW_OUTLETS_SUCCESS,
    data: data
})

export const showProfileSuccess = (data) => ({
    type: SHOW_PROFILE_SUCCESS,
    data: data
})

export const showSalesSuccess = (data) => ({
    type: SHOW_SALES_SUCCESS,
    data: data
})

export const showOrderSuccess = (data) => ({
    type: SHOW_ORDER_SUCCESS,
    data: data
})


export const setSummaryOrderCart = () => ({
    type: SET_SUMMARY_ORDER_CART,
})

export const showSubdistricsSuccess = (data) => ({
    type: SHOW_SUBDISTRICS_SUCCESS,
    data: data
})

export const showShipmentCostSuccess = (data) => ({
    type: SHOW_SHIPMENT_COST_SUCCESS,
    data: data
})

export const saveCheckoutData = (data) => ({
    type: SAVE_CHECKOUT_DATA,
    data: data
})

export const setNotificationData = (data) => ({
    type: SET_NOTIFICATION_DATA,
    data: data
})

export const setOnlineStoreName = (data) => ({
    type: SET_ONLINE_STORE_DATA,
    data: data
})

export const setOnlineStoreUserID = (data) => ({
    type: SET_ONLINE_STORE_USER_ID,
    data: data
})

export const showLogisticsSuccess = (data) => ({
    type: SHOW_LOGISTICS_SUCCESS,
    data: data
})

export const showOnlinePaymentsSuccess = (data) => ({
    type: SHOW_ONLINE_PAYMENTS_SUCCESS,
    data: data
})

export const setCounterValue = (data) => ({
  type: SET_COUNTER_VALUE,
  data: data
})
