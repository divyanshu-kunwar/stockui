// require file system for read and write
const fs = require('fs')

var favList = {
    1:{Company_name:"Reliance"}
}

fs.writeFile('./user_settings/fav_list.json', JSON.stringify(favList), err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })