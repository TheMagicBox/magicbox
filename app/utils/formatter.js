module.exports = {
    success: data => {
        return { status: 'success', data }
    },
    error: message => {
        return { status: 'error', message }
    }
}
