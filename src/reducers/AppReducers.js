import {
  SHOW_PRODUCT_PENDING,
  SHOW_PRODUCT_ERROR,
  SHOW_PRODUCT_SUCCESS,
  SHOW_MODIFIERS_SUCCESS,
  SAVE_CART,
  SHOW_ACTIVE_TAXES_SUCCESS,
  SHOW_ACTIVE_LATEST_DISCOUNT_SUCCESS,
  SHOW_OUTLETS_SUCCESS,
  SHOW_SALESTYPE_SUCCESS,
  SET_SUMMARY_ORDER_CART,
  SHOW_PROFILE_SUCCESS,
  SHOW_SALES_SUCCESS,
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
} from "../actions/types";

import moment from 'moment';

import Item1 from '../img/item1.jpg'
import Item2 from '../img/item2.jpg'
import Item3 from '../img/item3.jpg'
import Item4 from '../img/item4.jpg'
import Item5 from '../img/item5.jpg'
import Item6 from '../img/item6.jpg'

const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis','Jumat', 'Sabtu'];

const initState = {
    addedItems:[],
    total: 0,
    showProductsData: [],
    showProductsCategory: ['Semua', 'LCD', 'Monitor'],
    showModifiersData: [],
    showCartsData: [],
    showActiveTaxesData: [],
    showActiveLatestDiscountData: [],
    showOutletsData: [],
    showSalesTypeData: [],
    showProfileData: [],
    showSalesData: [],
    showSubdistricsData: [],
    showShipmentCostData: [],
    showSummaryOrderCartData: {},
    showCheckoutData: {},
    isLoading: false,
    isNetworkFailed: false,
    error: false,
    showNotificationData: {},
    showOnlineStoreName: '',
    showOnlineStoreUserId: {},
    showOrderData: [],
    showLogisticsData: [],
    showOnlinePaymentsData: [],
    counterValue: {}
}

const AppReducers = (state = initState, action) => {

  switch(action.type) {

    case SHOW_PRODUCT_PENDING:
      return {
        ...state,
        isLoading: true,
        isNetworkFailed: false
      };

/*
    case SHOW_PRODUCT_SUCCESS:
      let product_category = [...new Set(action.data.map(item => item.category))];
      product_category.unshift('Semua');

      return {
        ...state,
        showProductsData: action.data,
        showProductsCategory: product_category,
        isLoading: false
      };
*/

    case SHOW_PRODUCT_SUCCESS:
      let product_category = [...new Set(action.data.map(item => item.category))];
      product_category.unshift('Semua');
      product_category = product_category.filter((item) => item != 'Bahan Baku')

      var salestype_percentage = state.showSalesTypeData.filter((item) => item.name == 'Online')[0].percentage
      var product_items = action.data

      var products = []
      if (product_items.length > 0) {

        let discountData = state.showActiveLatestDiscountData
        let dateFilter = false
        let dayFilter = false

        if (discountData.length > 0) {

          if (discountData[0].start_dtm == '') {
            dateFilter = true
          }
          if (discountData[0].start_dtm != '' && discountData[0].end_dtm != '') {
            let vNow = new Date(moment().format('DD-MMM-YYYY')).getTime();
            let vStart = new Date(discountData[0].start_dtm).getTime();
            let vEnd = new Date(discountData[0].end_dtm).getTime();

            if (vNow >= vStart && vNow <= vEnd) {
              dateFilter = true
            }
          }

          if (discountData[0].custom_days.length > 0) {
            let today = hari[new Date().getDay()]
            if (discountData[0].custom_days.indexOf(today) > -1) {
              dayFilter = true
            }
          }

          product_items.forEach(function (item, index) {

            let discount_info = {}
            let discountAmount = 0
            let productFilter = false
            if (discountData[0].products.length > 0) {
              if (discountData[0].products.indexOf(item.sku_id) > -1) { productFilter = true}
            }

            //if (dateFilter && dayFilter && productFilter) {
            let foundProduct = false
            if (discountData[0].products.length == 0) {
              foundProduct = true
            } else {
              let foundProducts = discountData[0].products.find((sku_id => sku_id == item.sku_id))
              if (foundProducts) foundProduct = true
            }
            if (dateFilter && dayFilter && foundProduct) {
              discountAmount = discountData[0].amount
              if (discountData[0].percentage_or_rupiah == 'Percentage') { discountAmount = (item.sell_cost + item.sell_cost*salestype_percentage/100) * discountData[0].amount / 100}
              discount_info = {
                discount_info : {
                  name: discountData[0].name,
                  amount: Math.round(discountAmount),
                  quantity_or_rupiah: discountData[0].quantity_or_rupiah,
                  minimum_sales: discountData[0].minimum_sales,
                }
              }
            } else {
              discount_info = {
                discount_info : {
                  name: '',
                  amount: 0,
                  quantity_or_rupiah: '',
                  minimum_sales: 0,
                }
              }
            }
            let salestype_up = item.sell_cost*salestype_percentage/100
            let merged = {...discount_info, ...item, salestype_up};

            //Check and process taxes if available
            let taxInfo = []
            if (state.showActiveTaxesData.length > 0) {

              let tax = {}
              state.showActiveTaxesData.forEach(function (tax, index) {
                tax = {
                  name: tax.name,
                  amount: tax.percentage,
                  final: ((item.sell_cost + item.sell_cost*salestype_percentage/100) - Math.round(discountAmount)) * tax.percentage / 100,
                }
                taxInfo.push(tax)
              })

            }
            merged = {taxInfo, ...merged};
            products.push(merged)
          })

        } else { // No discounts at all
          product_items.forEach(function (item, index) {

            let discountAmount = 0
            let discount_info = {
                discount_info : {
                name: '',
                amount: 0
              }
            }
            let salestype_up = item.sell_cost*salestype_percentage/100
            let merged = {...discount_info, ...item, salestype_up};

            //Check and process taxes if available
            let taxInfo = []
            if (state.showActiveTaxesData.length > 0) {

              let tax = {}
              state.showActiveTaxesData.forEach(function (tax, index) {
                tax = {
                  name: tax.name,
                  amount: tax.percentage,
                  final: ((item.sell_cost + item.sell_cost*salestype_percentage/100) - Math.round(discountAmount)) * tax.percentage / 100
                }
                taxInfo.push(tax)
              })

            }
            merged = {taxInfo, ...merged};
            products.push(merged)
          })
        }
      }

      return {
        ...state,
        showProductsData : products,
        showProductsCategory: product_category,
        isLoading: false,
      };

    case SET_SUMMARY_ORDER_CART:
      console.log('--ARTAKA SET_SUMMARY_ORDER_CART: ', state.showCartsData)

      let totalTax = 0
      let totalServiceCharge = 0
      let totalPB1 = 0

      let orderSummary = {
        totalItems: state.showCartsData.reduce(function (accumulator, item) { return accumulator + item.number_orders;}, 0),
        subTotal: state.showCartsData.reduce(function (accumulator, item) { return accumulator + (item.sell_cost + item.salestype_up + item.modifiers_price) * item.number_orders;}, 0),
        totalDiskon: 0,
        totalTax: 0,
        totalServiceCharge: 0,
        totalPB1: 0,
        totalBuyCost: state.showCartsData.reduce(function (accumulator, item) { return accumulator + item.buy_cost_discounted * item.number_orders;}, 0), // use buy_cost already netted with discount
        salesTypeUp: state.showCartsData.reduce(function (accumulator, item) { return accumulator +  item.salestype_up * item.number_orders;}, 0),
        salesType: 'Online',
        totalWeight: state.showCartsData.reduce(function (accumulator, item) { return accumulator + item.weight * item.number_orders;}, 0),
      }

      //Check if discount meet minimum sales (rp/trx)
      let discount = state.showActiveLatestDiscountData
      if (discount.length > 0) {
        if (discount[0].quantity_or_rupiah == 'Minimal Jumlah Produk' && orderSummary.totalItems >= discount[0].minimum_sales) {
          orderSummary.totalDiskon = state.showCartsData.reduce(function (accumulator, item) { return accumulator + item.discount_info.amount * item.number_orders;}, 0)
        }

        if (discount[0].quantity_or_rupiah == 'Minimal Pembelian dalam Rupiah' && (orderSummary.subTotal + orderSummary.salesTypeUp) >= discount[0].minimum_sales) {
          orderSummary.totalDiskon = state.showCartsData.reduce(function (accumulator, item) { return accumulator + item.discount_info.amount * item.number_orders;}, 0)
        }
      }

      //Check if taxes is activated
      //state.tripleX.forEach((itm, index) => {
      //  if (itm.taxInfo.length > 0) {
      //    itm.taxInfo.forEach(function (item, index) {
      //      if (item.name == 'PPN') totalTax += item.final * itm.number_orders
      //      if (item.name == 'Service Charge') totalServiceCharge += item.final * itm.number_orders
      //      if (item.name == 'PB1') totalPB1 += item.final * itm.number_orders
      //    })
      //  }
      //})
      let tax = state.showActiveTaxesData
      if (tax && tax.length > 0) {
        tax.forEach(function (item, index) {
          if (item.name == 'PPN') totalTax += item.percentage * (orderSummary.subTotal - orderSummary.totalDiskon) / 100
          //Not applicable for online order
          //if (item.name == 'Service Charge') totalServiceCharge += item.percentage * (orderSummary.subTotal - orderSummary.totalDiskon) / 100
          //if (item.name == 'PB1') totalPB1 += item.percentage * (orderSummary.subTotal - orderSummary.totalDiskon) / 100
        })
        orderSummary.totalTax = Math.round(totalTax)
        orderSummary.totalServiceCharge = Math.round(totalServiceCharge)
        orderSummary.totalPB1 = Math.round(totalPB1)
      }
      console.warn('----ARTAKA SET_SUMMARY_ORDER_CART>>--: ',orderSummary)
      return {
        ...state,
        showSummaryOrderCartData : orderSummary,
      };


    case SHOW_PRODUCT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        isNetworkFailed: true,
      };

    case SHOW_MODIFIERS_SUCCESS:
      return {
        ...state,
        showModifiersData : action.data,
        isLoading: false
      };

    case SHOW_SALESTYPE_SUCCESS:
      return {
        ...state,
        showSalesTypeData : action.data,
        isLoading: false
      };

    case SHOW_ACTIVE_TAXES_SUCCESS:
      return {
        ...state,
        showActiveTaxesData : action.data,
      };

    case SHOW_ACTIVE_LATEST_DISCOUNT_SUCCESS:
      return {
        ...state,
        showActiveLatestDiscountData : action.data,
      };

    case SHOW_OUTLETS_SUCCESS:
      return {
        ...state,
        showOutletsData : action.data,
        isLoading: false
      };

    case SHOW_PROFILE_SUCCESS:
      return {
        ...state,
        showProfileData : action.data,
        isLoading: false
      };

    case SHOW_SALES_SUCCESS:
      return {
        ...state,
        showSalesData : action.data,
        isLoading: false
      };

    case SHOW_SUBDISTRICS_SUCCESS:
      return {
        ...state,
        showSubdistricsData : action.data,
        isLoading: false
      };

    case SHOW_SHIPMENT_COST_SUCCESS:
      return {
        ...state,
        showShipmentCostData : action.data,
        isLoading: false
      };

    case SAVE_CHECKOUT_DATA:
      console.warn('---ARTAKA SAVE_CHECKOUT_DATA: ', action.data)
      return {
        ...state,
        showCheckoutData : action.data,
      };

    case SET_NOTIFICATION_DATA:
      console.warn('ARTAKA: SET_NOTIFICATION_DATA: ', action.data)
      return {
        ...state,
        showNotificationData : action.data,
      };

    case SET_ONLINE_STORE_DATA:
      return {
        ...state,
        showOnlineStoreName : action.data,
      };

    case SET_ONLINE_STORE_USER_ID:
      return {
        ...state,
        showOnlineStoreUserId : action.data,
      };

    case SHOW_ORDER_SUCCESS:
      return {
        ...state,
        showOrderData : action.data,
      };

    case SHOW_LOGISTICS_SUCCESS:
      return {
        ...state,
        showLogisticsData : action.data,
      };

    case SHOW_ONLINE_PAYMENTS_SUCCESS:
      return {
        ...state,
        showOnlinePaymentsData : action.data,
      };

    case SET_COUNTER_VALUE:
      return {
        ...state,
        counterValue : action.data,
      };      
   
    case SAVE_CART:
      let cart = []

      action.data.forEach((item, i) => {

        let productDetail = state.showProductsData.filter(record => record.sku_id = item.sku_id)[0]
        let product = {
          sku_id: item.sku_id,
          name: item.name,
          category: productDetail.category,
          variant: item.variant,
          modifiers_price: item.modifiers_price,
          modifiers_option: item.modifiers_option,
          number_orders: item.numberOrder,
          buy_cost: item.buy_cost,
          buy_cost_discounted: item.buy_cost_discounted,
          sell_cost: item.price,
          weight: item.weight,
          units: productDetail.units,
          salestype_up: item.salestype_up,
          discount_info: item.discount_info,
          taxInfo: item.taxInfo,
          description: item.description
        }
        cart.push(product)
      });


      return {
        ...state,
        showCartsData : cart,
        isLoading: false
      };

    default:
      return state;

  }
}

export default AppReducers;
