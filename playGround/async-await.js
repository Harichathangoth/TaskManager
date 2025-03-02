

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            if(a < 0 || b < 0){
                reject(`can't add negative number`);
            }
             resolve(a+b);
        },2000)
    })
}

const doWork = async() => {
    const num1 = await add(4, -5);
    const num2 = await add(num1, 3);
    const num3 = await add(num2, 11)
    return num3
}


doWork().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
})