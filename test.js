const obj = {
  headless: true
}

const newObject = {
  headless: false,
  ...obj,
}

console.log(newObject);