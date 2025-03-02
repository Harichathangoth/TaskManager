
require('../src/DB/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('66c112b08f0706bc8443c801',{age : 16}).then((data) => {
//     console.log(data)
//     return User.countDocuments({age : 16})
// }).then((data) => {
//     console.log(data);
// }).catch((err) => {
//     console.log('Error:',err)
// })


const UpdateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

UpdateAgeAndCount('66bfd02b75b981397c53fb18', 22).then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error)
})