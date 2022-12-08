let str = window.location
let url = new URL(str);
let id = url.searchParams.get("id");

document.getElementById('orderId').innerHTML = id;