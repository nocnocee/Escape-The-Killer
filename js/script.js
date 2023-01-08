const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const sscoreElement = document.querySelector('#scoreElement')

const veloConst = 2
const killerVelo = 2
const hatchPosition = {
    x: 3,
    y: 7
}
const hatchPositionTwo = {
    x: 7,
    y: 3
}
const hatchPositionThree = {
    x: 11,
    y: 7
}
const hatchPositionFour = {
    x: 7,
    y: 11
}

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
    // drawing out boundaries to determine what it looks like
        c.fillStyle = '#556b2f'
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
        c.fillStyle = '#ffd700'
        c.fill()
        c.closePath()
    }
}

class Hatch {
    constructor({position}) {
        this.position = position
        this.radius = 20
        
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#FFFFFF'
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
        c.fillStyle = '#7fff00'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Killer {
    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
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
const hatches = []
var boundaries = []
const killer = [
    new Killer({
        position: {
            x: Boundary.width * 12 + Boundary.width /2,
            y: Boundary.height + Boundary.height /2
        },
        velocity: {
            x: killerVelo,
            y: 0
        }
    })
]
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
    ['-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', '.', ' ', ' ', '-', '-', '-', ' ', ' ', '.', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-',],
    ['-', ' ', ' ', '-', ' ', ' ', ' ', '.', ' ', ' ', ' ', '-', ' ', 'H', '-',],
    ['-', '-', '-', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', '.', ' ', ' ', '-', '-', '-', ' ', ' ', '.', ' ', ' ', '-',],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-',],
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
                break
            case 'H':
                hatches.push(
                    new Hatch({
                        position: {
                            x: j * Boundary.width + Boundary.width /2,
                            y: i * Boundary.height + Boundary.height /2 
                        }
                    })
                )
        }
    })
})
function circleCollidesWithRectangle({ circle, rectangle}) {
    const padding = Boundary.width /2 - circle.radius - 1
    return ( 
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && 
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && 
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && 
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    console.log(animationId)
    
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
            
            if (score >= 5) {
                newBoundary = []
                for (let i = 0; i < boundaries.length; i++) {
                    theBoundary = boundaries[i]
                    if (
                        !(theBoundary.position.x == theBoundary.width * hatchPosition.x && 
                        theBoundary.position.y == theBoundary.height * hatchPosition.y) 
                        && !(theBoundary.position.x == theBoundary.width * hatchPositionTwo.x && 
                        theBoundary.position.y == theBoundary.height * hatchPositionTwo.y) 
                        && !(theBoundary.position.x == theBoundary.width * hatchPositionThree.x && 
                        theBoundary.position.y == theBoundary.height * hatchPositionThree.y)
                        && !(theBoundary.position.x == theBoundary.width * hatchPositionFour.x && 
                        theBoundary.position.y == theBoundary.height * hatchPositionFour.y)
                    )
                        (newBoundary.push(theBoundary)
                    )
                }
                boundaries = newBoundary
            }
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
    
    for (let i = hatches.length - 1; 0 <= i; i--) {
        const hatch = hatches[i]
        hatch.draw()

        if (Math.hypot(
            hatch.position.x - player.position.x, 
            hatch.position.y - player.position.y
            ) 
            < hatch.radius + player.radius
        ) {
            cancelAnimationFrame(animationId)
            console.log('You Escaped!')
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
    // player.velocity.y = 0
    // player.velocity.x = 0

    killer.forEach((theKiller) => {
        theKiller.update()

        if (Math.hypot(
            theKiller.position.x - player.position.x, 
            theKiller.position.y - player.position.y
            ) 
            < theKiller.radius + player.radius
        ) {
            cancelAnimationFrame(animationId)
            console.log('You Died')
        }

        const collisions = []
        boundaries.forEach((Boundary) => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...theKiller, 
                        velocity: {
                            x: killerVelo,
                            y: 0
                        }
                    },
                    rectangle: Boundary
                })
            )   {
                collisions.push('right')
            }

            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...theKiller, 
                        velocity: {
                            x: killerVelo * -1,
                            y: 0
                        }
                    },
                    rectangle: Boundary
                })
            )   {
                collisions.push('left')
            }

            if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...theKiller, 
                        velocity: {
                            x: 0,
                            y: killerVelo * -1
                        }
                    },
                    rectangle: Boundary
                })
            )   {
                collisions.push('up')
            }

            if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...theKiller, 
                        velocity: {
                            x: 0,
                            y: killerVelo
                        }
                    },
                    rectangle: Boundary
                })
            )   {
                collisions.push('down')
            }
        })

        if (collisions.length > theKiller.prevCollisions.length)
        theKiller.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(theKiller.prevCollisions)) {
            // console.log('gogo')
            
            if (theKiller.velocity.x > 0) theKiller.prevCollisions.push('right')
            else if (theKiller.velocity.x < 0) theKiller.prevCollisions.push('left')
            else if (theKiller.velocity.y < 0) theKiller.prevCollisions.push('up')
            else if (theKiller.velocity.y > 0) theKiller.prevCollisions.push('down')
            
            console.log(collisions)
            console.log(theKiller.prevCollisions)

            const pathways = theKiller.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })
            console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            console.log({direction})

            switch (direction) {
                case 'down':
                    theKiller.velocity.y = killerVelo
                    theKiller.velocity.x = 0
                    break

                case 'up':
                    theKiller.velocity.y = killerVelo * -1
                    theKiller.velocity.x = 0
                    break

                case 'right':
                    theKiller.velocity.y = 0
                    theKiller.velocity.x = killerVelo
                    break

                case 'left':
                    theKiller.velocity.y = 0
                    theKiller.velocity.x = killerVelo * -1
                    break
            }

            theKiller.prevCollisions = []
        }
        // console.log(collisions)
    })
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
        player.velocity.y = 0
        player.velocity.x = 0

        break
        case 'a':
        keys.a.pressed = false
        player.velocity.y = 0
        player.velocity.x = 0

        break
        case 's':
        keys.s.pressed = false
        player.velocity.y = 0
        player.velocity.x = 0

        break
        case 'd':
        keys.d.pressed = false
        player.velocity.y = 0
        player.velocity.x = 0

        break
    }

    console.log(keys.d.pressed)
    console.log(keys.s.pressed)
})   

console.log(player.velocity)