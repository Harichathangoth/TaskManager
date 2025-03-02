require('../src/DB/mongoose')
const Task = require('../src/models/task')


// Task.findByIdAndDelete('66c3859e9c611f8aca02abe8').then((data) => {
//     console.log(data)
//     return Task.find({completed : false})
// }).then((data) => {
//     console.log(data)
//     return Task.countDocuments({completed : false})
// }).then((data) => {
//     console.log(data);
// }).catch((err) => {
//     console.log('Erorr:',err)
// })

const deleteTaskAndCount = async(_id) => {
    const task = await Task.findByIdAndDelete(_id);
    const count = await Task.countDocuments({ completed : false });
    return count;
}

deleteTaskAndCount('66c3add9d3a94a036bd5d609').then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
})