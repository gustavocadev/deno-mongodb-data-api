// import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { RouterContext } from 'https://deno.land/x/oak/mod.ts'

// const { DATA_API_KEY, APP_ID } = config()

const BASE_URI = `https://data.mongodb-api.com/app/${Deno.env.get("APP_ID")}/endpoint/data/beta/action`

const DATA_SOURCE = "Cluster0"
const DATABASE = "todo_db"
const COLLECTION = "todos"

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'api-key':  Deno.env.get("DATA_API_KEY") || ''
    },
    body: ""
}

const getTodos = async (ctx: RouterContext<'/'>) => {
    try {
        const URI = `${BASE_URI}/find`
        const query = {
            collection: COLLECTION,
            database: DATABASE,
            dataSource: DATA_SOURCE,
        }
        options.body = JSON.stringify(query);
        const dataResponse = await fetch(URI, options)
        const { documents } = await dataResponse.json()

        if (!documents) {
            ctx.response.body = {
                success: false,
                msg: "internal server error"
            }
            return
        }

        ctx.response.status = 200
        ctx.response.body = {
            success: true,
            documents
        }
        
    } catch (error) {
        ctx.response.body = {
            success: false,
            msg: error.toString()
        }
    }   
}

const getTodo = async (ctx: RouterContext<'/:id'>) => {
    try {
        const { id } = ctx.params

        if (!id) {
            ctx.response.body = {
                success: false,

            }
            return
        }
        console.log(id);
          const query = {
            collection: COLLECTION,
            database: DATABASE,
            dataSource: DATA_SOURCE,
            filter: {
                "_id": {
                    $oid: id
                }
            }
        }
        options.body = JSON.stringify(query)

        const URI = `${BASE_URI}/findOne`

        const res = await fetch(URI, options)
        const { document } = await res.json()

        if (!document) {
            ctx.response.body = {
                success: false,
                msg: "error"
            }
            return
        }


        ctx.response.status = 200
        ctx.response.body = {
            success: true,
            document
        }


    } catch (error) {
        ctx.response.body = {
            success: false,
            msg: error.toString()
        }
    }
}


const addTodo = async (ctx:RouterContext<'/'>) => {
    try {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400
            ctx.response.body = {
                success: false,
                msg: "No data"
            }
            return 
        }
        const body = ctx.request.body()
        const data = await body.value;
        const URI = `${BASE_URI}/insertOne`
        const query = {
            collection: COLLECTION,
            database: DATABASE,
            dataSource: DATA_SOURCE,
            document: data

        }
        options.body = JSON.stringify(query);
        const dataResponse = await fetch(URI, options)
        const {insertedId} = await dataResponse.json()

        ctx.response.status = 200
        ctx.response.body = {
            success: true,
            data,
            insertedId,
        }
    } catch (err) {
        ctx.response.body = {
            success: false,
            msg: err.toString()
        }
    }
}

const updateTodo = async (ctx: RouterContext<'/:id'>) => {
    const { id } = ctx.params

    const body = ctx.request.body()
    const { title, complete } = await body.value
    
      if (!id) {
            ctx.response.body = {
                success: false,

            }
            return
        }
          const query = {
            collection: COLLECTION,
            database: DATABASE,
            dataSource: DATA_SOURCE,
            filter: {
                 _id: {
                    $oid: id
                }
              },
            update: {
                $set: {
                    title,
                    complete,
                }
            }
        }
        options.body = JSON.stringify(query)

        const URI = `${BASE_URI}/updateOne`

        const res = await fetch(URI, options)
        const data = await res.json()

        if (!data) {
            ctx.response.body = {
                success: false,
                msg: "error"
            }
            return
        }


        ctx.response.status = 200
        ctx.response.body = {
            success: true,
            data
        }

}

const deleteTodo = async (ctx: RouterContext<'/:id'>) => {
      const { id } = ctx.params

      if (!id) {
            ctx.response.body = {
                success: false,

            }
            return
        }
          const query = {
            collection: COLLECTION,
            database: DATABASE,
            dataSource: DATA_SOURCE,
            filter: {
                 _id: {
                    $oid: id
                }
            }
        }
        options.body = JSON.stringify(query)

        const URI = `${BASE_URI}/deleteOne`

        const res = await fetch(URI, options)
        const data = await res.json()

        if (!data) {
            ctx.response.body = {
                success: false,
                msg: "error"
            }
            return
        }


        ctx.response.status = 200
        ctx.response.body = {
            success: true,
            data
        }

}

const getIncompleteTodos = async (ctx: RouterContext<'/incomplete/count'>) => {
    const URI = `${BASE_URI}/aggregate`

    const query = {
        collection: COLLECTION,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        pipeline: [
            {
                $match: {
                    complete: false,
                }
            },
            {
                $count: 'incomplete'
            }
        ]
    }
    options.body = JSON.stringify(query)
    const res = await fetch(URI, options)
    const data = await res.json()

    ctx.response.status = 200
    ctx.response.body = {
        success: true,
        data
    }

}

export {
    addTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo,
    getIncompleteTodos,
}