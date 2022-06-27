
let arr = ['1', '2', '3', '4'];
arr.filter((x) => {
    return  x === '1' || x === '2';
}).forEach(x => console.log(x))