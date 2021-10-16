var storage = firebase.storage();
var db = firebase.firestore();

createMemberList()
async function createMemberList() {
  let members = await getCollection("members")
  let membersTable = document.getElementById("members")
  // console.log(members.length)
  for (member in members) {
    let newRow = membersTable.insertRow(-1)
    for (i of ["icon", "name", "introduction", "link"]) {
      let newCell = newRow.insertCell()
      if (i == "icon") {
        let newImg = await createImgElement(members[member][i]);
        newCell.appendChild(newImg)
      } else if (i == "link") {
        let newLink = createLinkElement(members[member][i])
        newCell.appendChild(newLink)
      } else {
        let newText = ""
        if (members[member][i] != undefined) {
          newText = document.createTextNode(members[member][i])
        } else {
          newText = document.createTextNode("データなし")
        }
        newCell.appendChild(newText)
      }
    }
  }
}
async function createImgElement(imgName) {
  let newImg = document.createElement("img");
  let pathReference = storage.refFromURL('gs://projectknocks.appspot.com/' + imgName)
  // let url =await pathReference.getDownloadURL().then(function (url) {
  let url = await pathReference.getDownloadURL()
  newImg.src = url
  newImg.width = 50
  newImg.height = 50
  newImg.className = "rounded"
  return newImg
}

function createLinkElement(linkURL) {
  let newLink = document.createElement("a");
  if (linkURL != undefined) {
    newLink.href = linkURL
    newLink.textContent = "リンク"
  } else {
    newLink.textContent = "リンクなし"
  }
  return newLink
}

async function getCollection(collectionName) {
  let collection = []
  await db.collection(collectionName).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let item = {}
      item.id = doc.id
      for (var i in doc.data()) {
        if (doc.data().hasOwnProperty(i)) {
          item[i] = doc.data()[i]
        }
      }
      collection.push(item)
    });
  })
  return collection
}