function sleep (milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds)
  })
}

module.exports = {
  sleep
}
