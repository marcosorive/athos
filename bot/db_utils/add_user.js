const { createUser } = require('../src/User');

const username = process.argv[2];
const password = process.argv[3];

if( !username || !password ){
    console.log("Please introduce username and password");
    process.exit(1);
}

setImmediate(async () => {
    try{
        await createUser(username, password);
        console.log('User created correctly.');
    }catch(error){
        console.log('Error creatin the user');
        console.log(error);
    }
})
