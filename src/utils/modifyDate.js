const modifyDate = (currentTrDate) => {
    const day = currentTrDate.slice(0, 2)
    const month = currentTrDate.slice(3, 5)
    const year = currentTrDate.slice(6, 10)
    const currentEnDate = month + "." + day + "." + year
    return currentEnDate
}

module.exports = modifyDate 