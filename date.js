    
module.exports = function() {
    const event = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    return event.toLocaleDateString('en-GB', options)
}  
    