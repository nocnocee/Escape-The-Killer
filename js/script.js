const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const sscoreElement = document.querySelector('#scoreElement')

const veloConst = 2

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image}) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
    // drawing out boundaries to determine what it looks like
        c.fillStyle = '#444444'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Clues {
    constructor({position}) {
        this.position = position
        this.radius = 5
        
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#746ab0'
        c.fill()
        c.closePath()
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#f96209'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const clues = []
const boundaries = []
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width /2,
        y: Boundary.height + Boundary.height /2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', '-', '-', '-', '-', '-', ' ', ' ', ' ', '-', '-', '-', '-', '-', '-',],
    ['-', '-', '-', '-', '-', '-', ' ', '.', ' ', '-', '-', '-', '-', '-', '-',],
    ['-', '-', '-', '-', '-', '-', ' ', ' ', ' ', '-', '-', '-', '-', '-', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', '.', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],
    
]

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
                    }))
                break
            case '.':
                clues.push(
                    new Clues({
                        position: {
                            x: j * Boundary.width + Boundary.width /2,
                            y: i * Boundary.height + Boundary.height /2 
                        }
                    })
                )
        }
    })
})
function circleCollidesWithRectangle({
    circle,
    rectangle
}) {
    return ( 
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && 
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x && 
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y && 
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
    )
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const Boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, 
                        velocity: {
                            x: 0,
                            y: veloConst * -1
                        }
                    },
                    rectangle: Boundary
                })
            ) {
                player.velocity.y = 0
                break
            }   else {
                player.velocity.y = veloConst * -1
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const Boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, 
                        velocity: {
                            x: veloConst * -1,
                            y: 0
                        }
                    },
                    rectangle: Boundary
                })
            ) {
                player.velocity.x = 0
                break
            }   else {
                player.velocity.x = veloConst * -1
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const Boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, 
                        velocity: {
                            x: 0,
                            y: veloConst
                        }
                    },
                    rectangle: Boundary
                })
            ) {
                player.velocity.y = 0
                break
            }   else {
                player.velocity.y = veloConst
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const Boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, 
                        velocity: {
                            x: veloConst,
                            y: 0
                        }
                    },
                    rectangle: Boundary
                })
            ) {
                player.velocity.x = 0
                break
            }   else {
                player.velocity.x = veloConst
            }
        }
    }

    // touch clues here
    for (let i = clues.length - 1; 0 <= i; i--) {
        const clue = clues[i]
        clue.draw()

        if (Math.hypot(
            clue.position.x - player.position.x, 
            clue.position.y - player.position.y
            ) 
            < clue.radius + player.radius
        ) {
            console.log('found!')
            clues.splice(i, 1)
            score += 1
            sscoreElement.innerHTML =score
        }
    }

    boundaries.forEach((Boundary) => {
        Boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: Boundary
            })
        ) {
        player.velocity.x = 0
        player.velocity.y = 0
        }
    })
    
    player.update() 
    player.velocity.y = 0
    player.velocity.x = 0
}

animate()


addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
    
    console.log(keys.d.pressed)
    console.log(keys.s.pressed)
})   

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
        keys.w.pressed = false

        break
        case 'a':
        keys.a.pressed = false

        break
        case 's':
        keys.s.pressed = false

        break
        case 'd':
        keys.d.pressed = false

        break
    }

    console.log(keys.d.pressed)
    console.log(keys.s.pressed)
})   

console.log(player.velocity)