export function currencyFormat(num) {
  return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function formatNumberX(num) {
  let temp = 0
  if (num != '') {
    temp = parseInt(num)
  }
  return temp.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function phoneNormPlus(num) {
  if (num.length > 2) {
    if (num.substr(0,3) == '628') {
      return '+' + num
    } else if (num.substr(0,4) == '+628') {
      return num
    } else if (num.substr(0,2) == '08') {
      return '+62' + num.slice(1)
    } else if (num.substr(0,1) == '8') {
      return '+62' + num
    } else {
      return num
    }
  } else {
    return num
  }
}

export function phoneNorm(num) {
  if (num.length > 2) {
    if (num.substr(0,3) == '628') {
      return num
    } else if (num.substr(0,4) == '+628') {
      return num.slice(1)
    } else if (num.substr(0,2) == '08') {
      return '62' + num.slice(1)
    } else if (num.substr(0,1) == '8') {
      return '62' + num
    }
  } else {
    return num
  }
}

export function phoneNormContacts(num) {
  if (num.length > 2) {
    let msisdn = num.replace(/-/g,'').replace(/ /g,'')
    if (msisdn.substr(0,3) == '628') {
      return msisdn
    } else if (msisdn.substr(0,4) == '+628') {
      return msisdn.slice(1)
    } else if (msisdn.substr(0,2) == '08') {
      return '62' + msisdn.slice(1)
    } else if (msisdn.substr(0,1) == '8') {
      return '62' + msisdn
    }
  } else {
    return num.replace(/-/g,'').replace(/ /g,'')
  }
}

export function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function capitalizeWords(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //mode: 'cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
