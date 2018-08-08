if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(registeration => {
      console.log("SW REGISTERED!!");
    })
    .catch(err => {
      console.log("SW FAILED TO REGISTER!!", err);
    });
}

function getData() {
  return fetch("https://api.github.com/users/defunkt/followers")
    .then(res => {
      let data = res.json();
      return data;
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log("err", err);
      return err;
    });
}

async function showData() {
  const nameList = document.querySelector(".namesList");

  let data = await getData();

  data.map(item => {
    let nameItem = document.createElement("li");

    nameItem.appendChild(document.createTextNode(item.login));

    nameList.appendChild(nameItem);
  });
  return nameList;
}

showData();
