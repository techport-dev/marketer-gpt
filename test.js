function test(args){
  return args([1,2,3]);
}



console.log(test((prev) => [...prev,10] ));