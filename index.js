const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app=express()

app.use(express.json())
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())

app.use(express.static('dist'))

let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const person=persons.find(person=>person.id===id)
    person?response.json(person): response.status(404).end()
})

app.delete('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    persons=persons.filter(person=>person.id!==id)

    response.status(204).end()

})

app.post('/api/persons',(request,response)=>{
    const person=request.body

    if(!person.name || !person.number){
        return response.status(400).json({
            error:"name or number is missing"
        }).end()
    }

    const existing = persons.find(p=>p.name===person.name)
    if(existing){
        return response.status(400).json({
            error:"name must be unique"
        })
    }
    person.id=String(Math.floor(Math.random()*(10000000-0+1)+0))
    persons=persons.concat(person)
    response.json(person)
})

const date = new Date()

app.get('/info',(request,response)=>{
    let count= persons.length
    response.send(`<p>Phonebook has info for ${count} people
        </br> 
        ${date.toLocaleString('en-US', { weekday: 'short' })}
        ${date.toLocaleString('en-US', { month: 'short' })}
        ${date.getDate()}
        ${date.getFullYear()}
        ${date.toLocaleTimeString()}
        ${date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]}</p>`)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})