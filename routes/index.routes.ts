import { Router } from 'https://deno.land/x/oak/mod.ts'
import {addTodo, getTodos, getTodo, updateTodo, deleteTodo, getIncompleteTodos} from '../controllers/index.controllers.ts'

const router = new Router()

router.get('/', getTodos)
router.get('/:id', getTodo)

router.get('/incomplete/count', getIncompleteTodos)

router.post('/', addTodo)

router.put('/:id', updateTodo)

router.delete('/:id', deleteTodo)

export default router
