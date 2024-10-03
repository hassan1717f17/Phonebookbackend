const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app=express()

app.use(express.json())
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())

app.use(express.static('dist'))


app.get('/api/persons',(request, response)=>{
    Person.find({})
        .then(persons=>{
            response.json(persons)
        })
})

app.get('/api/persons/:id',(request,response)=>{
    Person.findbyId(request.params.id)
        .then(person=>{
            if(person){
                response.json(person)
            }else{
                response.status(404).end()
            }
        }).catch(error=>response.status(400).send({error:'malformatted id'}))
})

app.delete('/api/persons/:id',(request,response)=>{
    Person.findByIdAndRemove(request.params.id)
        .then(()=>response.status(204).end())
        .catch(error=>response.status(400).send({error:'malformatted id'}))

})

app.post('/api/persons',(request,response)=>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error:"name or number is missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })
})

const date = new Date()

app.get('/info',(request,response)=>{
    Person.countDocument({}).then(count=>{
    response.send(`<p>Phonebook has info for ${count} people
        </br> 
        ${date.toLocaleString('en-US', { weekday: 'short' })}
        ${date.toLocaleString('en-US', { month: 'short' })}
        ${date.getDate()}
        ${date.getFullYear()}
        ${date.toLocaleTimeString()}
        ${date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]}</p>`)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})