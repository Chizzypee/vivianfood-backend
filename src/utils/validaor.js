const regex = new RegExp("[a-z,0-9]+@[a-z+.[a-z]{2,3")

const isEmailValid = (email) => {
    return regex.test(email)
}


module.exports ={
    isEmailValid
}