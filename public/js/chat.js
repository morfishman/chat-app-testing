const socket = io();


const $massegeForm = document.querySelector('#massege-form')
const $inputMasseg = $massegeForm.querySelector('input')
const $buttonMasseg = $massegeForm.querySelector('button')
const $buttonLocation = document.querySelector('#location')
const $masseges = document.querySelector('#masseges')

const massegetamplate = document.querySelector('#massage-template').innerHTML
const locationtamplate = document.querySelector('#location-template').innerHTML
const sidebattemplate = document.querySelector('#sidebar_template').innerHTML

const { username,room } = Qs.parse(location.search,{ignoreQueryPrefix: true})


const outoscroll =() => {
    const $newMessage = $masseges.lastElementChild


    const newMessagestyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessagestyles.marginBottom)
    const newMessageHight = $newMessage.offsetHeight + newMessageMargin
    

    const visibalhight = $masseges.offsetHeight


    const containerHight = $masseges.scrollHeight


    const scrolloffset = $masseges.scrollTop + visibalhight

    if (containerHight - newMessageHight <= scrolloffset) {
        $masseges.scrollTop = $masseges.scrollHeight
    }
}


socket.on('Massege', (Mseg) => {
    console.log(Mseg)
    const html = Mustache.render(massegetamplate,{
        username: Mseg.username,
        massage: Mseg.text,
        createdAt: moment(Mseg.createdAt).format("H:mm a"),
    })
    $masseges.insertAdjacentHTML('beforeend',html)
    outoscroll()
})

socket.on('locationMassege', (data) => {
    console.log(data)
    const html = Mustache.render(locationtamplate,{
        username: data.username,
        url: data.url,
        createdAt: moment(data.createdAt).format("H:mm a"),
    })
    $masseges.insertAdjacentHTML('beforeend',html)
    outoscroll()
})

socket.on('roomData', ({room,users}) => {
    const html =  Mustache.render(sidebattemplate,{
        room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html

})

$massegeForm.addEventListener('submit', (event) => {
    event.preventDefault()

    $buttonMasseg.setAttribute('disabled','disabled')

    let massge = event.target.elements.masseg.value
    socket.emit('SendMaeg',massge, (error) => {
        $buttonMasseg.removeAttribute('disabled')
        $inputMasseg.value = ''
        $inputMasseg.focus();
        if(error){
            return console.log(error)
        }
        console.log('massege deleverd')
    })
})

$buttonLocation.addEventListener('click', (e) => {
    if (!navigator.geolocation){
        return alert('geolocation doesnt sepurted by your matchin!')
    }
    $buttonLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((possition) => {
        socket.emit('SendLocation',{
            latitude: possition.coords.latitude,
            longitude: possition.coords.longitude,

        }, () => {
            $buttonLocation.removeAttribute('disabled')
            console.log('location deliverd')
        })
    })
})


socket.emit('join', {username, room} , (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})