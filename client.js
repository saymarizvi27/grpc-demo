const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const text = process.argv[2];
const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", 
grpc.credentials.createInsecure())
console.log(text);

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {

    console.log("Recieved from server " + JSON.stringify(response))

});

// client.readTodos(null, (err, response) => {
//     console.log("read the todos from server " + JSON.stringify(response))
//     if (!response.items)
//         response.items.forEach(a=>console.log(a.text));
// });

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})

call.on("end", e => console.log("server done!"));